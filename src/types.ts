import PlayerContract from "./contracts/player-contract";
import RegionContract from "./contracts/region-contract";

export type Side = "HOME" | "AWAY";

export type PlayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type PlayerNumberWithoutGoalkeeper = Exclude<PlayerNumber, 1>;

export type PlayerPosition = { col: number | null; row: number | null };

export type HoldedPlayer = { player: PlayerContract; region: RegionContract | null; is_permitted_region: boolean };

export type FormationType = "FREE" | "INITIAL_POSITIONS";

export type Color = { r: number; g: number; b: number };

export type TeamPositions = { [key in PlayerNumber]: PlayerPosition };

export type TeamPositionsWithoutGoalkeeper = { [key in PlayerNumberWithoutGoalkeeper]: PlayerPosition };

export type FieldZoneCreator = {
    uuid?: string;
    color: Color;
    start_col: number;
    end_col: number;
    start_row: number;
    end_row: number;
};

export type FormationCreator = {
    uuid?: string;
    name: string;
    type?: FormationType;
    field_zone?: FieldZoneCreator;
    team_positions?: TeamPositions;
    block_goal_area?: boolean;
};

export type StrategyCreator = {
    uuid?: string;
    name: string;
    cols: number;
    rows: number;
    current_formation_uuid?: string;
    formations?: FormationCreator[];
};

export type GlobalStateLocalStorage = {
    current_strategy_uuid: string;
    strategies: StrategyCreator[];
    side: Side;
    show_col_and_rows: boolean;
    show_zone_fields: boolean;
};

export type FieldZoneDefinition = {
    startCol: number;
    endCol: number;
    startRow: number;
    endRow: number;
};

export type ExportType = "STRATEGY" | "POSITIONS";

export type TeamPositionsExport = { type: ExportType; data: TeamPositionsWithoutGoalkeeper };

export type FotmationWithoutGoalkeeperExport = { [key in PlayerNumberWithoutGoalkeeper]: PlayerPosition };

export type StrategyExport = { type: ExportType; data: StrategyCreator };

export type FormationsExport = { [key: string]: FotmationWithoutGoalkeeperExport };

export type FieldZonesExport = { start_col: number; end_col: number; start_row: number; end_row: number; id: string }[];
