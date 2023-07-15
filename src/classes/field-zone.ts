import { Vector2D } from "@mauricioroberto/math-world";

import { Color, FieldZoneCreator } from "../types";
import { getRegionFromColAndRow } from "../helpers/field";
import global from "../global";
import FieldZoneContract from "../contracts/field-zone-contract";
import { v4 } from "uuid";

export default class FieldZone implements FieldZoneContract {
    private uuid: string;
    private name: string;
    private color: Color;
    private start_col: number;
    private end_col: number;
    private start_row: number;
    private end_row: number;

    constructor({ uuid, name, color, start_col, end_col, start_row, end_row }: FieldZoneCreator) {
        this.uuid = uuid ?? v4();
        this.name = name;
        this.color = color;
        this.start_col = Math.min(start_col, end_col);
        this.end_col = Math.max(start_col, end_col);
        this.start_row = Math.min(start_row, end_row);
        this.end_row = Math.max(start_row, end_row);
    }

    public getName(): string {
        return this.name;
    }

    public getColor(): Color {
        return this.color;
    }

    public getStartCol(): number {
        return this.start_col;
    }

    public getEndCol(): number {
        return this.end_col;
    }

    public getStartRow(): number {
        return this.start_row;
    }

    public getEndRow(): number {
        return this.end_row;
    }

    public getWidth(): number {
        return global.getRegionWidth() * (this.end_col - this.start_col + 1);
    }

    public getHeight(): number {
        return global.getRegionHeight() * (this.end_row - this.start_row + 1);
    }
    public getUuid(): string {
        return this.uuid;
    }

    public getCenter(): Vector2D {
        const start = this.getStart();
        return new Vector2D().setX(start.getX() + this.getWidth() / 2).setY(start.getY() + this.getHeight() / 2);
    }

    public getStart(): Vector2D {
        return this.getBottomLeft();
    }

    public getEnd(): Vector2D {
        return this.getTopRight();
    }

    public getTopLeft(): Vector2D {
        if (global.isHomeSide()) return getRegionFromColAndRow(this.start_col, this.end_row)?.getTopLeft() as Vector2D;
        return getRegionFromColAndRow(this.end_col, this.start_row)?.getTopLeft() as Vector2D;
    }

    public getTopRight(): Vector2D {
        if (global.isHomeSide()) return getRegionFromColAndRow(this.end_col, this.end_row)?.getTopRight() as Vector2D;
        return getRegionFromColAndRow(this.start_col, this.start_row)?.getTopRight() as Vector2D;
    }

    public getBottomLeft(): Vector2D {
        if (global.isHomeSide()) return getRegionFromColAndRow(this.start_col, this.start_row)?.getBottomLeft() as Vector2D;
        return getRegionFromColAndRow(this.end_col, this.end_row)?.getBottomLeft() as Vector2D;
    }

    public getBottomRight(): Vector2D {
        if (global.isHomeSide()) return getRegionFromColAndRow(this.start_col, this.end_row)?.getBottomRight() as Vector2D;
        return getRegionFromColAndRow(this.end_col, this.start_row)?.getBottomRight() as Vector2D;
    }

    public toJson(): string {
        return JSON.stringify(this.getCreatorData());
    }

    public getCreatorData(): FieldZoneCreator {
        return {
            uuid: this.getUuid(),
            name: this.getName(),
            color: this.getColor(),
            start_col: this.getStartCol(),
            end_col: this.getEndCol(),
            start_row: this.getStartRow(),
            end_row: this.getEndRow(),
        };
    }
}
