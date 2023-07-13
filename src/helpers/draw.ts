import { Paint } from "@mauricioroberto/math-world";
import { FIELD_HEIGHT, FIELD_POINT_1, FIELD_POINT_CENTER, FIELD_WIDTH, GOAL_RADIUS, HOME_GOAL_BOTTOM, HOME_GOAL_CENTER, HOME_GOAL_TOP, AWAY_GOAL_BOTTOM, AWAY_GOAL_CENTER, AWAY_GOAL_TOP } from "./constants";
import global from "../global";

export function drawField(paint: Paint): void {
    // LINHAS LATERAIS
    paint.rect({ point: FIELD_POINT_1, width: FIELD_WIDTH, height: -FIELD_HEIGHT, lineWidth: 20 });

    // LINHA DO CENTRO
    paint.line({ startPoint: { x: FIELD_POINT_CENTER.x, y: 0 }, endPoint: { x: FIELD_POINT_CENTER.x, y: FIELD_HEIGHT }, lineWidth: 10 });

    // PONTO DO CENTRO
    paint.circle({ point: FIELD_POINT_CENTER, radius: 50, lineWidth: 10, fillColor: "white" });

    // CÍRCULO DO CENTRO
    paint.circle({ point: FIELD_POINT_CENTER, radius: 1000, lineWidth: 10 });

    // GOL HOME
    paint
        .line({ startPoint: { x: HOME_GOAL_TOP.getX() - 70, y: HOME_GOAL_TOP.getY() }, endPoint: { x: HOME_GOAL_TOP.getX() + 70, y: HOME_GOAL_TOP.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: HOME_GOAL_CENTER.getX() - 70, y: HOME_GOAL_CENTER.getY() }, endPoint: { x: HOME_GOAL_CENTER.getX() + 70, y: HOME_GOAL_CENTER.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: HOME_GOAL_BOTTOM.getX() - 70, y: HOME_GOAL_BOTTOM.getY() }, endPoint: { x: HOME_GOAL_BOTTOM.getX() + 70, y: HOME_GOAL_BOTTOM.getY() }, lineWidth: 20 });

    paint.line({ startPoint: { x: 1400, y: HOME_GOAL_TOP.getY() }, endPoint: { x: 1400, y: HOME_GOAL_BOTTOM.getY() }, lineWidth: 20 });
    paint.circle({ point: HOME_GOAL_TOP, radius: GOAL_RADIUS, startAngleForHumans: 0, endAngleForHumans: 90, lineWidth: 20 });
    paint.circle({ point: HOME_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngleForHumans: 270, endAngleForHumans: 360, lineWidth: 20 });

    // GOL AWAY
    paint
        .line({ startPoint: { x: AWAY_GOAL_TOP.getX() - 70, y: AWAY_GOAL_TOP.getY() }, endPoint: { x: AWAY_GOAL_TOP.getX() + 70, y: AWAY_GOAL_TOP.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: AWAY_GOAL_CENTER.getX() - 70, y: AWAY_GOAL_CENTER.getY() }, endPoint: { x: AWAY_GOAL_CENTER.getX() + 70, y: AWAY_GOAL_CENTER.getY() }, lineWidth: 20 })
        .line({ startPoint: { x: AWAY_GOAL_BOTTOM.getX() - 70, y: AWAY_GOAL_BOTTOM.getY() }, endPoint: { x: AWAY_GOAL_BOTTOM.getX() + 70, y: AWAY_GOAL_BOTTOM.getY() }, lineWidth: 20 });

    paint.line({ startPoint: { x: FIELD_WIDTH - 1400, y: AWAY_GOAL_TOP.getY() }, endPoint: { x: FIELD_WIDTH - 1400, y: AWAY_GOAL_BOTTOM.getY() }, lineWidth: 20 });
    paint.circle({ point: AWAY_GOAL_TOP, radius: GOAL_RADIUS, startAngleForHumans: 90, endAngleForHumans: 180, lineWidth: 20 });
    paint.circle({ point: AWAY_GOAL_BOTTOM, radius: GOAL_RADIUS, startAngleForHumans: 180, endAngleForHumans: 270, lineWidth: 20 });
}

export function drawRegions(paint: Paint): void {
    for (let col = 0; col < global.getCols(); col++) {
        for (let row = 0; row < global.getRows(); row++) {
            const x = global.isHomeSide() ? col * global.getRegionWidth() : FIELD_WIDTH - (col + 1) * global.getRegionWidth();
            const y = global.isHomeSide() ? row * global.getRegionHeight() : FIELD_HEIGHT - (row + 1) * global.getRegionHeight();

            paint.rect({ point: { x: x, y: y + global.getRegionHeight() }, width: global.getRegionWidth(), height: global.getRegionHeight(), strokeColor: "rgba(255, 255, 255, 0.2)" });
            paint.text({ point: { x: x + global.getRegionWidth() / 2, y: y + global.getRegionHeight() / 2 }, textSize: 175, text: `${col}x${row}`, textColor: "rgba(255, 255, 255, 0.2)" });
        }
    }
}