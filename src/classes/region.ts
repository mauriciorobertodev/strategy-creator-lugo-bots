import { Vector2D } from "@mauricioroberto/math-world";
import { FIELD_HEIGHT, FIELD_WIDTH } from "../helpers/constants";
import global from "../global";
import RegionContract from "../contracts/region-contract";

export default class Region implements RegionContract {
    private start: Vector2D;
    private end: Vector2D;
    private center: Vector2D;
    private width: number;
    private height: number;
    private top_left: Vector2D;
    private top_right: Vector2D;
    private bottom_left: Vector2D;
    private bottom_right: Vector2D;

    constructor(
        private col: number,
        private row: number,
    ) {
        const startX = global.isHomeSide() ? global.getRegionWidth() * col : FIELD_WIDTH - global.getRegionWidth() * (col + 1);
        const startY = global.isHomeSide() ? global.getRegionHeight() * row : FIELD_HEIGHT - global.getRegionHeight() * (row + 1);

        const endX = startX + global.getRegionWidth();
        const endY = startY + global.getRegionHeight();

        this.width = global.getRegionWidth();
        this.height = global.getRegionHeight();

        this.top_left = new Vector2D(startX, endY);
        this.top_right = new Vector2D(endX, endY);
        this.bottom_left = new Vector2D(startX, startY);
        this.bottom_right = new Vector2D(endX, startY);

        this.start = new Vector2D().setX(startX).setY(startY);
        this.end = new Vector2D().setX(endX).setY(endY);
        this.center = new Vector2D().setX(startX + this.width / 2).setY(startY + this.height / 2);
    }

    public getCol(): number {
        return this.col;
    }

    public getRow(): number {
        return this.row;
    }

    public getCenter(): Vector2D {
        return this.center;
    }

    public getStart(): Vector2D {
        return this.start;
    }

    public getEnd(): Vector2D {
        return this.end;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getTopLeft(): Vector2D {
        return this.top_left;
    }

    public getTopRight(): Vector2D {
        return this.top_right;
    }

    public getBottomLeft(): Vector2D {
        return this.bottom_left;
    }

    public getBottomRight(): Vector2D {
        return this.bottom_right;
    }
}
