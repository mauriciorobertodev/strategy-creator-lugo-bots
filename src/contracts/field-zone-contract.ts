import { Vector2D } from "@mauricioroberto/math-world";
import { Color, FieldZoneCreator, FieldZoneDefinition } from "../types";

export default interface FieldZoneContract {
    getColor(): Color;
    setColor(color: Color): void;
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
    getCreatorData(uuid: boolean): FieldZoneCreator;
    toJson(): string;
    getUuid(): string;
    setDefinition(definition: FieldZoneDefinition): void;
    getDefinition(): FieldZoneDefinition;
}
