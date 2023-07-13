import { PaintContract, Vector2D } from "@mauricioroberto/math-world";
import { PlayerNumber } from "../types";

export default interface PlayerContract {
    draw(paint: PaintContract): void;
    getNumber(): PlayerNumber;
    getRadius(): number;
    getPosition(): Vector2D;
    setPosition(position: Vector2D): void;
    setDirection(direction: Vector2D): void;
    getInitialPosition(): Vector2D;
    getDirection(): Vector2D;
    getInitialDirection(): Vector2D;
    getCol(): number | null;
    getRow(): number | null;
    setColAndRow(col: number, row: number): void;
    resetColAndRow(): void;
    hasColAndRow(): boolean;
    resetPosition(): void;
    updatePositionByColAndRow(): void;
}
