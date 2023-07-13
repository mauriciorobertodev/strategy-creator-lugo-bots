import { MathWorld } from "@mauricioroberto/math-world";
import { drawField } from "./helpers/draw";

const loop = (world: MathWorld) => {
    // VARIÁVEIS
    const paint = world.getPaint();
    paint.cartesian();

    // LOOP
    return (): void => {
        // DESENHANDO O CAMPO
        drawField(paint);
    };
};

export default loop;
