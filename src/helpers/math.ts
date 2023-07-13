import { Vector2D } from "@mauricioroberto/math-world";

export function angleInRadians(a: Vector2D, b?: Vector2D) {
    if (b) return Math.atan2(b.getY() - a.getY(), b.getX() - a.getX());
    return Math.atan2(a.getY(), a.getX());
}

export function radiansToDegrees(radians: number) {
    return radians * (180 / Math.PI);
}
