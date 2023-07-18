import global from "../global";
import { FormationCommonExport, FormationFullExport, StrategyCreator } from "../types";

export function exportFullFormation(): FormationFullExport {
    const players = global.getPlayers();
    return {
        1: { col: 0, row: 0 },
        2: { col: players[0].getCol(), row: players[0].getRow() },
        3: { col: players[1].getCol(), row: players[1].getRow() },
        4: { col: players[2].getCol(), row: players[2].getRow() },
        5: { col: players[3].getCol(), row: players[3].getRow() },
        6: { col: players[4].getCol(), row: players[4].getRow() },
        7: { col: players[5].getCol(), row: players[5].getRow() },
        8: { col: players[6].getCol(), row: players[6].getRow() },
        9: { col: players[7].getCol(), row: players[7].getRow() },
        10: { col: players[8].getCol(), row: players[8].getRow() },
        11: { col: players[9].getCol(), row: players[9].getRow() },
    };
}

export function exportCommonFormation(): FormationCommonExport {
    const players = global.getPlayers();
    return {
        2: { col: players[0].getCol(), row: players[0].getRow() },
        3: { col: players[1].getCol(), row: players[1].getRow() },
        4: { col: players[2].getCol(), row: players[2].getRow() },
        5: { col: players[3].getCol(), row: players[3].getRow() },
        6: { col: players[4].getCol(), row: players[4].getRow() },
        7: { col: players[5].getCol(), row: players[5].getRow() },
        8: { col: players[6].getCol(), row: players[6].getRow() },
        9: { col: players[7].getCol(), row: players[7].getRow() },
        10: { col: players[8].getCol(), row: players[8].getRow() },
        11: { col: players[9].getCol(), row: players[9].getRow() },
    };
}

export function exportCurrentStrategy(): StrategyCreator {
    const data = global.getCurrentStrategy().getCreatorData();
    data.uuid = undefined;
    data.current_formation_uuid = undefined;
    return data;
}
