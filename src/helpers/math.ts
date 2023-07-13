import { Vector2D } from "@mauricioroberto/math-world";

export function angleInRadians(a: Vector2D, b?: Vector2D) {
    if (b) return Math.atan2(b.getY() - a.getY(), b.getX() - a.getX());
    return Math.atan2(a.getY(), a.getX());
}

export function radiansToDegrees(radians: number) {
    return radians * (180 / Math.PI);
}

export function getDistanceBetweenVectors(a: Vector2D, b: Vector2D): number {
    const deltaX = a.getX() - b.getX();
    const deltaY = a.getY() - b.getY();
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

export function getDirectionToVector(a: Vector2D, b: Vector2D): Vector2D {
    const angle = angleInRadians(a, b);

    const cos = Math.abs(Math.cos(angle)) < Number.EPSILON ? 0 : Math.cos(angle);
    const sin = Math.abs(Math.sin(angle)) < Number.EPSILON ? 0 : Math.sin(angle);

    return new Vector2D(cos, sin);
}
