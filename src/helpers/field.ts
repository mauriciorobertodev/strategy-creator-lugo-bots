import global from "../global";
import RegionContract from "../contracts/region-contract";
import Region from "../classes/region";
import { Vector2D } from "@mauricioroberto/math-world";
import { AWAY_GOAL_BOTTOM, AWAY_GOAL_TOP, CENTER_FIELD_RADIUS, FIELD_HEIGHT, FIELD_POINT_CENTER, FIELD_WIDTH, GOAL_RADIUS, HOME_GOAL_BOTTOM, HOME_GOAL_TOP } from "./constants";
import { getDistanceBetweenVectors, getShortPointBetweenLineAndPoint } from "./math";

export function getRegionFromColAndRow(col: number, row: number): RegionContract | null {
    if (col > global.getCols() - 1 || col < 0) return null;
    if (row > global.getRows() - 1 || row < 0) return null;

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

export default function isPermittedRegion(region: RegionContract) {
    // SE O PONTO CENTRAL DA REGIÃO FOR NA ÀREA DO GOL NÃO É PERMITIDO
    if (global.currentFormationTypeIs("INITIAL_POSITIONS") || global.getBlockGoalArea()) {
        const distanceToHomeGoal = getShortPointBetweenLineAndPoint(HOME_GOAL_TOP, HOME_GOAL_BOTTOM, region.getCenter()).distance;
        const distanceToAwayGoal = getShortPointBetweenLineAndPoint(AWAY_GOAL_TOP, AWAY_GOAL_BOTTOM, region.getCenter()).distance;

        if (distanceToHomeGoal < GOAL_RADIUS || distanceToAwayGoal < GOAL_RADIUS) return false;
    }

    // NA FORMAÇÃO INICIAL O CÍRCULO DO CENTRO NÃO PODE SER USADO, NEM O CAMPO ADVERSÁRIO OU A LINHA DO CENTRO
    if (global.currentFormationTypeIs("INITIAL_POSITIONS")) {
        const distanceToCenterPoint = getDistanceBetweenVectors(region.getCenter(), FIELD_POINT_CENTER);
        if (distanceToCenterPoint <= CENTER_FIELD_RADIUS) return false;

        const centerX = region.getCenter().getX();
        if (global.isHomeSide() && centerX >= FIELD_WIDTH / 2) return false;
        if (global.isAwaySide() && centerX <= FIELD_WIDTH / 2) return false;
    }

    return true;
}
