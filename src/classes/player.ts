import { Vector2D } from "@mauricioroberto/math-world";
import { PlayerNumber } from "../types";
import PlayerContract from "../contracts/player-contract";
import { getPlayerInitialPosition } from "../helpers/players";
import { getRegionFromColAndRow } from "../helpers/field";

export default class Player implements PlayerContract {
    private number: PlayerNumber;
    private position: Vector2D;
    private initial_position: Vector2D;
    private direction: Vector2D;
    private initial_direction: Vector2D;
    private color: string | CanvasGradient | CanvasPattern;
    private col: number | null = null;
    private row: number | null = null;
    private radius: number;

    constructor(number: PlayerNumber, position: Vector2D, direction?: Vector2D, radius?: number, color?: string | CanvasGradient | CanvasPattern) {
        this.number = number;
        this.position = position.clone();
        this.initial_position = position.clone();
        this.direction = direction ? direction.clone() : new Vector2D(1, 0);
        this.initial_direction = direction ? direction.clone() : new Vector2D(1, 0);
        this.color = color ?? "#3b82f6";
        this.radius = radius ?? 250;
    }

    public getColor(): string | CanvasGradient | CanvasPattern {
        return this.color;
    }

    public getNumber(): PlayerNumber {
        return this.number;
    }

    public getRadius(): number {
        return this.radius;
    }

    public getPosition(): Vector2D {
        return this.position;
    }

    public setPosition(position: Vector2D): void {
        this.position = position.clone();
    }

    public setDirection(direction: Vector2D): void {
        this.direction = direction.clone();
    }

    public getInitialPosition(): Vector2D {
        return this.initial_position;
    }

    public getDirection(): Vector2D {
        return this.direction;
    }

    public getInitialDirection(): Vector2D {
        return this.initial_direction;
    }

    public getCol(): number | null {
        return this.col;
    }

    public getRow(): number | null {
        return this.row;
    }

    public setColAndRow(col: number, row: number): void {
        this.col = col;
        this.row = row;
        this.updatePositionByColAndRow();
    }

    public resetColAndRow(): void {
        this.col = null;
        this.row = null;
    }

    public hasColAndRow(): boolean {
        return this.col != null && this.row != null ? true : false;
    }

    public resetPosition(): void {
        this.position = getPlayerInitialPosition(this.getNumber()).clone();
        this.resetColAndRow();
    }

    public updatePositionByColAndRow(): void {
        if (this.col === null || this.col < 0 || this.row === null || this.row < 0) return;
        const region = getRegionFromColAndRow(this.col, this.row);
        if (region) this.setPosition(region.getCenter());
        if (!region) this.resetPosition();
    }
}
