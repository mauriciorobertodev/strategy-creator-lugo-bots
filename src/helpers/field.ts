import global from "../global";
import RegionContract from "../contracts/region-contract";
import Region from "../classes/region";
import { Vector2D } from "@mauricioroberto/math-world";
import { AWAY_GOAL_BOTTOM, AWAY_GOAL_TOP, CENTER_FIELD_RADIUS, FIELD_HEIGHT, FIELD_POINT_CENTER, FIELD_WIDTH, GOAL_RADIUS, HOME_GOAL_BOTTOM, HOME_GOAL_TOP } from "./constants";
import { getDistanceBetweenVectors, getShortPointBetweenLineAndPoint } from "./math";
import FieldZoneContract from "../contracts/field-zone-contract";
import { FieldZoneDefinition } from "../types";

export function getRegionFromColAndRow(col: number, row: number): RegionContract | null {
    if (col > global.getCurrentStrategy().getCols() - 1 || col < 0) return null;
    if (row > global.getCurrentStrategy().getRows() - 1 || row < 0) return null;

    return new Region(col, row);
}

export function getRegionFromPoint(point: Vector2D): Region | null {
    const x = point.getX();
    const y = point.getY();

    const col = global.isHomeSide() ? Math.floor(x / global.getRegionWidth()) : Math.floor((FIELD_WIDTH - x) / global.getRegionWidth());
    const row = global.isHomeSide() ? Math.floor(y / global.getRegionHeight()) : Math.floor((FIELD_HEIGHT - y) / global.getRegionHeight());

    if (col > global.getCurrentStrategy().getCols() - 1 || col < 0) return null;
    if (row > global.getCurrentStrategy().getRows() - 1 || row < 0) return null;

    return new Region(col, row);
}

export default function isPermittedRegion(region: RegionContract) {
    // SE O USUÁRIO ESTÁ SELECIONANDO UMA ZONA A REGIÃO SÓ NÃO É PERMITIDA CASO ESTEJA EM CONFLITO COM OUTRA ZONA
    if (global.getCurrentStrategy().getCurrentFormation().isSelectingTheZone()) {
        const fieldZone = getFieldZoneByColAndRow(region.getCol(), region.getRow());

        if (fieldZone) {
            if (global.getCurrentStrategy().getCurrentFormation().hasFieldZone()) {
                const zone = global.getCurrentStrategy().getCurrentFormation().getFieldZone();
                if (zone.getUuid() === fieldZone?.getUuid()) return true;
            }
            return false;
        }

        return true;
    }

    // SE O PONTO CENTRAL DA REGIÃO FOR NA ÀREA DO GOL NÃO É PERMITIDO
    if (global.currentFormationTypeIs("INITIAL_POSITIONS") || global.getCurrentStrategy().getCurrentFormation().getBlockGoalArea()) {
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

export function getFieldZoneByColAndRow(col: number, row: number): FieldZoneContract | undefined {
    if (global.isFreeMode()) return undefined;
    return global
        .getCurrentStrategy()
        .getFieldZones()
        .find((zone) => col >= zone.getStartCol() && col <= zone.getEndCol() && row >= zone.getStartRow() && row <= zone.getEndRow());
}

export function isPermittedFieldZone(definition: FieldZoneDefinition): boolean {
    if (global.isFreeMode()) return false;

    const start_col = Math.min(definition.startCol, definition.endCol);
    const end_col = Math.max(definition.startCol, definition.endCol);
    const start_row = Math.min(definition.startRow, definition.endRow);
    const end_row = Math.max(definition.startRow, definition.endRow);

    if (start_col < 0 || start_row < 0 || end_col < 0 || end_row < 0) return false;
    if (start_col > global.getCurrentStrategy().getCols() || start_row > global.getCurrentStrategy().getRows() || end_col > global.getCurrentStrategy().getCols() || end_row > global.getCurrentStrategy().getRows()) return false;

    const result = global
        .getCurrentStrategy()
        .getFieldZones()
        .filter((zone) => {
            if (global.getCurrentStrategy().getCurrentFormation().hasFieldZone()) {
                if (zone.getUuid() === global.getCurrentStrategy().getCurrentFormation().getFieldZone().getUuid()) return false;
            }
            return true;
        })
        .find((zone) => {
            if (
                end_col >= zone.getStartCol() && // r1 right edge past r2 left
                start_col <= zone.getEndCol() && // r1 left edge past r2 right
                end_row >= zone.getStartRow() && // r1 top edge past r2 bottom
                start_row <= zone.getEndRow()
            ) {
                // r1 bottom edge past r2 top
                return zone;
            }
        });
    return result ? false : true;
}
