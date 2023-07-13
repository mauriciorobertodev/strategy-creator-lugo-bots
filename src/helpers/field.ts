import global from "../global";
import RegionContract from "../contracts/region-contract";
import Region from "../classes/region";
import { Vector2D } from "@mauricioroberto/math-world";
import { FIELD_HEIGHT, FIELD_WIDTH } from "./constants";

export function getRegionFromColAndRow(col: number, row: number): RegionContract | null {
    if (col > global.getCols() - 1 || col < 0) return null;
    if (row > global.getRows() - 1 || row < 0) return null;

    console.log(global.getCols());

    return new Region(col, row);
}

export function getRegionFromPoint(point: Vector2D): Region | null {
    const x = point.getX();
    const y = point.getY();

    const col = global.isHomeSide() ? Math.floor(x / global.getRegionWidth()) : Math.floor((FIELD_WIDTH - x) / global.getRegionWidth());
    const row = global.isHomeSide() ? Math.floor(y / global.getRegionHeight()) : Math.floor((FIELD_HEIGHT - y) / global.getRegionHeight());

    if (col > global.getCols() - 1 || col < 0) return null;
    if (row > global.getRows() - 1 || row < 0) return null;

    return new Region(col, row);
}
