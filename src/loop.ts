import { MathWorld } from "@mauricioroberto/math-world";
import { drawField, drawRegions } from "./helpers/draw";
import global from "./global";
import { getDistanceBetweenVectors } from "./helpers/math";

const loop = (world: MathWorld) => {
    // VARIÁVEIS
    const paint = world.getPaint();

    // SETUP
    world.onLeftCLick(onLeftClick);
    world.onMouseUp(onMouseUp);
    paint.cartesian();

    // LOOP
    return (): void => {
        const MOUSE = world.getMousePositionInCartesian();

        // DESENHANDO O CAMPO
        drawField(paint);

        // DESENHANDO AS REGIÕES
        drawRegions(paint);

        // DESENHANDO OS JOGADORES E O GOLEIRO
        global.getPlayers().forEach((player) => player.draw(paint));
        global.getGoalkeeper().draw(paint);

        // ATUALIZA POSIÇÃO DO JOGADOR QUE O USUÁRIO ESTÁ SEGURANDO
        if (global.hasHoldedPlayer()) global.getHoldedPlayer().setPosition(MOUSE);
    };

    // VERIFICANDO SE O CLIQUE É UM JOGADOR PARA MUDAR SUA POSIÇÃO
    function onLeftClick() {
        const MOUSE = world.getMousePositionInCartesian();

        // VERIFICANDO A DISTÂNCIA E SETANDO O PLAYER COMO JOGADOR QUE DEVE SER MOVIDO
        global.getPlayers().find((player) => {
            const distance = getDistanceBetweenVectors(MOUSE, player.getPosition());
            if (distance <= player.getRadius() + 15) {
                global.setHoldedPlayer(player);
                return player;
            }
        });
    }

    function onMouseUp() {
        // SE NÃO TIVER JOGADOR SENDO SEGURADO O LIBERTE
        if (global.hasHoldedPlayer()) global.resetHoldedPlayer();
    }
};

export default loop;
