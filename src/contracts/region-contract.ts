import { Vector2D } from "@mauricioroberto/math-world";

export default interface RegionContract {
    getCol(): number;
    getRow(): number;
    getCenter(): Vector2D;
    getWidth(): number;
    getHeight(): number;
    getStart(): Vector2D;
    getEnd(): Vector2D;
    getTopLeft(): Vector2D;
    getTopRight(): Vector2D;
    getBottomLeft(): Vector2D;
    getBottomRight(): Vector2D;
}
