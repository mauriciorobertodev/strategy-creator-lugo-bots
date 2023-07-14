import global from "../global";
import { FormationFullExport } from "../types";

export function updatePlayersByJsonFile(jsonFile: File) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
        const json = JSON.parse(event.target.result) as FormationFullExport;

        global.getPlayers().forEach((player) => {
            if (player.getNumber() == 1 || !json[player.getNumber()]) return;
            const position = json[player.getNumber()];
            if (position.col != null && position.col >= 0 && position.row != null && position.row >= 0) {
                player.setColAndRow(position.col, position.row);
            }
        });
    };
    reader.readAsText(jsonFile);
}
