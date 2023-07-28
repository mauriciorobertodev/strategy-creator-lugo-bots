import global from "../global";
import { FormationsExport, FieldZonesExport, TeamPositionsExport, StrategyExport } from "../types";
import { safeString } from "./util";

export function exportTeamPositions(): TeamPositionsExport {
    const players = global.getPlayers();
    return {
        type: "POSITIONS",
        data: {
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
        },
    };
}

export function exportCurrentStrategy(): StrategyExport {
    const data = global.getCurrentStrategy().getCreatorData(false);
    data.current_formation_uuid = undefined;
    return { type: "STRATEGY", data };
}

export function exportFormationsOfStrategy(): FormationsExport {
    const data: FormationsExport = {};
    const formations = global.getCurrentStrategy().getFormations();

    formations.forEach((formation) => {
        data[safeString(formation.getName()).toUpperCase()] = formation.getTeamPositionsWithoutGoalkeeper();
    });

    return data;
}
export function exportFieldZonesOfStrategy(): FieldZonesExport {
    const formations = global.getCurrentStrategy().getFormationsWithFieldZones();

    return formations.map((formation) => {
        const zone = formation.getFieldZone();
        return {
            start_col: zone.getStartCol(),
            end_col: zone.getEndCol(),
            start_row: zone.getStartRow(),
            end_row: zone.getEndRow(),
            id: safeString(formation.getName()).toUpperCase(),
        };
    });
}
export function exportFormationNamesOfStrategy(): string[] {
    const formations = global.getCurrentStrategy().getFormations();

    return formations.map((formation) => {
        console.log(safeString(formation.getName()).toUpperCase());
        return safeString(formation.getName()).toUpperCase();
    });
}
