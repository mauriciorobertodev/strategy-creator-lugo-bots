import Strategy from "../classes/strategy";
import global from "../global";
import { PlayerNumberWithoutGoalkeeper, StrategyExport, TeamPositionsExport } from "../types";

export function importTeamPositions(jsonFile: File) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as TeamPositionsExport;

        if (!json?.type || !json?.data || json.type != "POSITIONS") return;

        const positions = json.data;

        global.getPlayers().forEach((player) => {
            if (player.getNumber() == 1 || !positions[player.getNumber() as PlayerNumberWithoutGoalkeeper]) return;
            global.setPlayerColAndRow(player.getNumber(), positions[player.getNumber() as PlayerNumberWithoutGoalkeeper]);
        });
    };

    reader.readAsText(jsonFile);
}

export function importStrategy(jsonFile: File, strategyName?: string) {
    const reader = new FileReader();

    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as StrategyExport;

        if (!json?.type || !json?.data || json.type != "STRATEGY") return;

        if (strategyName) json.data.name = strategyName;

        const strategy = new Strategy(json.data);

        global.addStrategy(strategy);
        global.setCurrentStrategy(strategy.getUuid());
    };

    reader.readAsText(jsonFile);
}
