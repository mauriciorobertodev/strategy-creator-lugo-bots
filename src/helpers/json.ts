import Strategy from "../classes/strategy";
import global from "../global";
import { FormationFullExport, StrategyExport } from "../types";
import { AWAY_GOAL_CENTER, HOME_GOAL_CENTER } from "./constants";

export function updatePlayersByJsonFile(jsonFile: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as FormationFullExport;
        updatePlayerByFormationExport(json);
    };
    reader.readAsText(jsonFile);
}

export function importStrategyByJson(jsonFile: File, strategyName?: string) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as StrategyExport;
        if (strategyName) json.name = strategyName;
        const strategy = new Strategy(json);
        global.addStrategy(strategy);
        global.setCurrentStrategy(strategy.getUuid());
    };
    reader.readAsText(jsonFile);
}

function updatePlayerByFormationExport(formation: FormationFullExport) {
    global.getPlayers().forEach((player) => {
        if (player.getNumber() == 1 || !formation[player.getNumber()]) return;
        const position = formation[player.getNumber()];
        if (position.col != null && position.col >= 0 && position.row != null && position.row >= 0) {
            player.setColAndRow(position.col, position.row);
            global.setPlayerPosition(player.getNumber(), { col: position.col, row: position.row });
        }
    });

    global.getGoalkeeper().setPosition(global.isHomeSide() ? HOME_GOAL_CENTER : AWAY_GOAL_CENTER);
}
