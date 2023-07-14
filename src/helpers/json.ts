import global from "../global";
import { FormationFullExport, FreeModeConfig } from "../types";

export function updatePlayersByJsonFile(jsonFile: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as FormationFullExport;
        updatePlayerByFormationExport(json);
    };
    reader.readAsText(jsonFile);
}

export function updateFreeModeByJsonFile(jsonFile: File) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as FreeModeConfig;

        if (!isFreeModeConfig(json)) {
            console.log("tem nada");
            return;
        }

        global.setColsAndRows(json.cols, json.rows);
        global.setSide(json.side);
        global.setShowColsAndRows(json.show_cols_and_rows);
        global.setBlockGoalArea(json.block_goal_area);
        global.setCurrentFormationType(json.formation_type);

        updatePlayerByFormationExport(json.formation);
    };
    reader.readAsText(jsonFile);
}

function isFreeModeConfig(json: FreeModeConfig): boolean {
    let isFreeConfigMode = true;

    if (!json.cols || !json.rows || json.cols < 2) isFreeConfigMode = false;
    if (!json.side || (json.side != "AWAY" && json.side != "HOME")) isFreeConfigMode = false;
    if (json.show_cols_and_rows != false && json.show_cols_and_rows != true) isFreeConfigMode = false;
    if (json.block_goal_area != false && json.block_goal_area != true) isFreeConfigMode = false;
    if (json.formation_type != "FREE" && json.formation_type != "INITIAL_POSITIONS") isFreeConfigMode = false;

    return isFreeConfigMode;
}

function updatePlayerByFormationExport(formation: FormationFullExport) {
    global.getPlayers().forEach((player) => {
        if (player.getNumber() == 1 || !formation[player.getNumber()]) return;
        const position = formation[player.getNumber()];
        if (position.col != null && position.col >= 0 && position.row != null && position.row >= 0) {
            player.setColAndRow(position.col, position.row);
        }
    });
}
