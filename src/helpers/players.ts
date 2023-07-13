import { Vector2D } from "@mauricioroberto/math-world";

const INITIAL_X = 10000 - 3600;

export function getPlayerInitialPosition(number: number): Vector2D {
    return new Vector2D(INITIAL_X + (number - 2) * 800, 0);
}
