import PlayerContract from "./contracts/player-contract";
import RegionContract from "./contracts/region-contract";

export type Side = "HOME" | "AWAY";

export type PlayerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type HoldedPlayer = { player: PlayerContract; region: RegionContract | null };
