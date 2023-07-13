import global from "../global";
import RegionContract from "../contracts/region-contract";
import Region from "../classes/region";

export function getRegionFromColAndRow(col: number, row: number): RegionContract | null {
    if (col > global.getCols() - 1 || col < 0) return null;
    if (row > global.getRows() - 1 || row < 0) return null;

    console.log(global.getCols());

    return new Region(col, row);
}
