import { MathWorld } from "@mauricioroberto/math-world";
import { drawField, drawRegions } from "./helpers/draw";

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
    };
};

export default loop;
