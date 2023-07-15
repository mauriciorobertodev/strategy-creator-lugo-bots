import PlayerContract from "./contracts/player-contract";
import RegionContract from "./contracts/region-contract";

export type Side = "HOME" | "AWAY";

export type PlayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type PlayerNumberWithoutGoalkeeper = Exclude<PlayerNumber, 1>;

export type PlayerPosition = { col: number | null; row: number | null };

export type HoldedPlayer = { player: PlayerContract; region: RegionContract | null; is_permitted_region: boolean };

export type FormationType = "FREE" | "INITIAL_POSITIONS" | "ZONE";

export type FormationFullExport = { [key in PlayerNumber]: PlayerPosition };

export type FormationCommonExport = { [key in PlayerNumberWithoutGoalkeeper]: PlayerPosition };

export type FreeModeConfig = { cols: number; rows: number; side: Side; show_cols_and_rows: boolean; formation_type: FormationType; block_goal_area: boolean; formation: FormationFullExport };

export type Color = { r: number; g: number; b: number };

export type TeamPositions = { [key in PlayerNumber]: PlayerPosition };
