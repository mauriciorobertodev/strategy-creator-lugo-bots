import { Vector2D } from "@mauricioroberto/math-world";
import { Color, FieldZoneCreator } from "../types";

export default interface FieldZoneContract {
    getName(): string;
    getColor(): Color;
    getStartCol(): number;
    getStartRow(): number;
    getEndCol(): number;
    getEndRow(): number;
    getCenter(): Vector2D;
    getWidth(): number;
    getHeight(): number;
    getTopLeft(): Vector2D;
    getTopRight(): Vector2D;
    getBottomLeft(): Vector2D;
    getBottomRight(): Vector2D;
    getCreatorData(): FieldZoneCreator;
    toJson(): string;
    getUuid(): string;
}
