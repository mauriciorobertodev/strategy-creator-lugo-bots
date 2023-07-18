import { MathWorld } from "@mauricioroberto/math-world";
import { drawField, drawFieldZones, drawPlayers, drawRegions } from "./helpers/draw";
import global from "./global";
import { getDistanceBetweenVectors } from "./helpers/math";
import isPermittedRegion, { getRegionFromPoint, isPermittedFieldZone } from "./helpers/field";
import RegionContract from "./contracts/region-contract";

const loop = (world: MathWorld) => {
    // VARIÁVEIS
    const paint = world.getPaint();
    let selecting_zone = false;
    let initial_region: RegionContract | undefined;

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

        drawFieldZones(paint);

        // DESENHANDO OS JOGADORES
        if (!global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) drawPlayers(paint);

        // ATUALIZA POSIÇÃO DO JOGADOR QUE O USUÁRIO ESTÁ SEGURANDO
        if (global.hasHoldedPlayer()) global.getHoldedPlayer().player.setPosition(MOUSE);

        if (global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
            const regionInMousePoint = getRegionFromPoint(MOUSE);

            // DESENHANDO A ZONA QUE O MOUSE ESTÁ EM CIMA PARA INDICAR AO O USUÁRIO
            if (!selecting_zone && regionInMousePoint) {
                const temporaryFieldZone = global.getTemporaryZone();
                const color = temporaryFieldZone.getColor();
                const allowedRegion = isPermittedRegion(regionInMousePoint);

                let borderColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
                let fillColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`;

                if (!allowedRegion) {
                    borderColor = paint.getTailwindColor("Red", "500");
                    fillColor = paint.getTailwindColor("Red", "500", 30);
                }

                paint.rect({ point: regionInMousePoint.getTopLeft(), width: regionInMousePoint.getWidth(), height: regionInMousePoint.getHeight(), lineWidth: 20, strokeColor: borderColor, fillColor });
            }
        }
    };

    function onLeftClick() {
        const MOUSE = world.getMousePositionInCartesian();

        // SE O USUÁRIO ESTIVER SELECIONANDO UMA ZONA O CLIQUE É A REGIÃO INICIAL DA ZONA
        if (global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
            const region = getRegionFromPoint(MOUSE);
            if (region) initial_region = region;
            selecting_zone = true;
            return; // RETORNANDO APENAS PARA NÃO EXECUTAR AS VERIFICAÇÕES ABAIXO, JÁ QUE NA SELEÇÃOD E ZONA NÃO HÁ JOGADORES
        }

        // SE TIVER UM JOGADOR ABAIXO DO MOUSE, SETAMOS ELE COMO JOGADOR QUE ESTÁ SENDO SEGURADO PELO USUÁRIO
        if (global.hasPlayerUnderMouse()) {
            const region = getRegionFromPoint(global.getPlayerUnderMouse().getPosition());
            global.setHoldedPlayer({ player: global.getPlayerUnderMouse(), region, is_permitted_region: region ? isPermittedRegion(region) : false });
            global.resetPlayerUnderMouse();
        }
    }

    function onMouseUp() {
        if (selecting_zone) selecting_zone = false;

        // SE NÃO TIVER JOGADOR SENDO SEGURADO NÃO TEMOS NADA PARA FAZER AQUI
        if (!global.hasHoldedPlayer()) return;

        const player = global.getHoldedPlayer().player;
        const region = global.getHoldedPlayer().region;
        const allowedRegion = global.getHoldedPlayer().is_permitted_region;

        // O PLAYER SEGURA ESTÁ EMCIMA DE UMA REGIÃO ENTÃO ELE DEVE FICA NO CENTRO DELA, E HERDAR SUA COLUNA E LINHA
        if (region && allowedRegion) {
            player.setColAndRow(region.getCol(), region.getRow());
            global.setPlayerPosition(player.getNumber(), { col: region.getCol(), row: region.getRow() });
            player.setPosition(region.getCenter());
        }

        // SE NÃO TIVER SÓ RESETAMOS A POSIÇÃO DELE PARA IR PARA A LINHA DE JOGADORES
        if (!region || !allowedRegion) player.resetPosition();

        // POR FIM REMOVEMOS O PLAYER SENDO SEGURADO POIS O JOGADOR QUE ANTES ESTAVA AGORA JÁ NÃO ESTÁ MAIS SENDO SEGURADO
        global.resetHoldedPlayer();
    }

    function onMouseMove() {
        const MOUSE = world.getMousePositionInCartesian();

        if (global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
            const region = getRegionFromPoint(MOUSE);
            if (!selecting_zone || !region || !initial_region) return;
            const allowedRegion = isPermittedRegion(region);

            if (!allowedRegion) return;

            const zoneDefinition = {
                startCol: initial_region.getCol(),
                endCol: region.getCol(),
                startRow: initial_region.getRow(),
                endRow: region.getRow(),
            };

            const allowedFieldZone = isPermittedFieldZone(zoneDefinition);

            if (!allowedFieldZone) return;

            global.getTemporaryZone().setDefinition(zoneDefinition);

            return; // RETORNANDO APENAS PARA NÃO EXECUTAR AS VERIFICAÇÕES ABAIXO, NÃO SÃO NECESSÁRIAS
        }

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
