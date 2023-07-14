import { MathWorld } from "@mauricioroberto/math-world";
import { drawField, drawPlayers, drawRegions } from "./helpers/draw";
import global from "./global";
import { getDistanceBetweenVectors } from "./helpers/math";
import isPermittedRegion, { getRegionFromPoint } from "./helpers/field";

const loop = (world: MathWorld) => {
    // VARIÁVEIS
    const paint = world.getPaint();

    // SETUP
    world.onLeftCLick(onLeftClick);
    world.onMouseUp(onMouseUp);
    world.onMouseMove(onMouseMove);
    paint.cartesian();

    // LOOP
    return (): void => {
        const MOUSE = world.getMousePositionInCartesian();

        // DESENHANDO O CAMPO
        drawField(paint);

        // DESENHANDO AS REGIÕES
        drawRegions(paint);

        // DESENHANDO OS JOGADORES
        drawPlayers(paint);

        // ATUALIZA POSIÇÃO DO JOGADOR QUE O USUÁRIO ESTÁ SEGURANDO
        if (global.hasHoldedPlayer()) global.getHoldedPlayer().player.setPosition(MOUSE);
    };

    function onLeftClick() {
        // SE TIVER UM JOGADOR ABAIXO DO MOUSE, SETAMOS ELE COMO JOGADOR QUE ESTÁ SENDO SEGURADO PELO USUÁRIO
        if (global.hasPlayerUnderMouse()) {
            const region = getRegionFromPoint(global.getPlayerUnderMouse().getPosition());
            global.setHoldedPlayer({ player: global.getPlayerUnderMouse(), region, is_permitted_region: region ? isPermittedRegion(region) : false });
            global.resetPlayerUnderMouse();
        }
    }

    function onMouseUp() {
        // SE NÃO TIVER JOGADOR SENDO SEGURADO NÃO TEMOS NADA PARA FAZER AQUI
        if (!global.hasHoldedPlayer()) return;

        const player = global.getHoldedPlayer().player;
        const region = global.getHoldedPlayer().region;
        const allowedRegion = global.getHoldedPlayer().is_permitted_region;

        // O PLAYER SEGURA ESTÁ EMCIMA DE UMA REGIÃO ENTÃO ELE DEVE FICA NO CENTRO DELA, E HERDAR SUA COLUNA E LINHA
        if (region && allowedRegion) {
            player.setColAndRow(region.getCol(), region.getRow());
            player.setPosition(region.getCenter());
        }

        // SE NÃO TIVER SÓ RESETAMOS A POSIÇÃO DELE PARA IR PARA A LINHA DE JOGADORES
        if (!region || !allowedRegion) player.resetPosition();

        // POR FIM REMOVEMOS O PLAYER SENDO SEGURADO POIS O JOGADOR QUE ANTES ESTAVA AGORA JÁ NÃO ESTÁ MAIS SENDO SEGURADO
        global.resetHoldedPlayer();
    }

    function onMouseMove() {
        const MOUSE = world.getMousePositionInCartesian();

        // SE TIVER UM JOGADOR SENDO SEGURADO NÃO FAZ SENTIDO ADICIONARMOS ELE COMO ABAIXO DO MOUSE POIS JÁ O TEMOS NO GLOBAL
        if (global.hasHoldedPlayer()) {
            const region = getRegionFromPoint(global.getHoldedPlayer().player.getPosition());
            global.getHoldedPlayer().region = region;
            global.getHoldedPlayer().is_permitted_region = region ? isPermittedRegion(region) : false;
            global.resetPlayerUnderMouse();
            return;
        }

        // VERIFICANDO A DISTÂNCIA COM O MOUSE
        const playerUnderMouse = global.getPlayers().find((player) => {
            const distance = getDistanceBetweenVectors(MOUSE, player.getPosition());
            if (distance <= player.getRadius()) return player;
        });

        // SE TIVER UM JOGADOR A BAIXO DO MOUSE SETAMOS ELE NO GLOBAL
        if (playerUnderMouse) global.setPlayerUnderMouse(playerUnderMouse);

        // SE NÃO RESETAMOS DO GLOBAL PARA NÃO CAUSAR CONFLITOS
        if (!playerUnderMouse) global.resetPlayerUnderMouse();
    }
};

export default loop;
