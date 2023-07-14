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

export function getAngleBetweenVectorsInRadians(a: Vector2D, b: Vector2D) {
    return Math.atan2(b.getY() - a.getY(), b.getX() - a.getX());
}

export function getShortPointBetweenLineAndPoint(startLine: Vector2D, endLine: Vector2D, point: Vector2D): { distance: number; point: Vector2D; angle: number } {
    const A = point.getX() - startLine.getX();
    const B = point.getY() - startLine.getY();
    const C = endLine.getX() - startLine.getX();
    const D = endLine.getY() - startLine.getY();

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = startLine.getX();
        yy = startLine.getY();
    } else if (param > 1) {
        xx = endLine.getX();
        yy = endLine.getY();
    } else {
        xx = startLine.getX() + param * C;
        yy = startLine.getY() + param * D;
    }

    const dx = point.getX() - xx;
    const dy = point.getY() - yy;
    const shortPoint = new Vector2D(xx, yy);
    return { distance: Math.sqrt(dx * dx + dy * dy), point: shortPoint, angle: getAngleBetweenVectorsInRadians(shortPoint, point) };
}
