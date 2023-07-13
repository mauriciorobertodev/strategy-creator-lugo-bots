import { MathWorld } from "@mauricioroberto/math-world";
import { drawField, drawRegions } from "./helpers/draw";
import global from "./global";

const loop = (world: MathWorld) => {
    // VARIÁVEIS
    const paint = world.getPaint();
    paint.cartesian();

    // LOOP
    return (): void => {
        // DESENHANDO O CAMPO
        drawField(paint);

        // DESENHANDO AS REGIÕES
        drawRegions(paint);

        // DESENHANDO OS JOGADORES
        global.getPlayers().forEach((player) => player.draw(paint));
    };
};

export default loop;
