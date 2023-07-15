import { Vector2D } from "@mauricioroberto/math-world";
import Player from "../classes/player";
import { HOME_GOAL_CENTER } from "./constants";
import PlayerContract from "../contracts/player-contract";
import { TeamPositions } from "../types";

const INITIAL_X = 10000 - 3600;

export function getGoalkeeper(): PlayerContract {
    return new Player(1, HOME_GOAL_CENTER);
}

export function getPlayers(): PlayerContract[] {
    return [
        new Player(2, new Vector2D(INITIAL_X + 0 * 800, 0)),
        new Player(3, new Vector2D(INITIAL_X + 1 * 800, 0)),
        new Player(4, new Vector2D(INITIAL_X + 2 * 800, 0)),
        new Player(5, new Vector2D(INITIAL_X + 3 * 800, 0)),
        new Player(6, new Vector2D(INITIAL_X + 4 * 800, 0)),
        new Player(7, new Vector2D(INITIAL_X + 5 * 800, 0)),
        new Player(8, new Vector2D(INITIAL_X + 6 * 800, 0)),
        new Player(9, new Vector2D(INITIAL_X + 7 * 800, 0)),
        new Player(10, new Vector2D(INITIAL_X + 8 * 800, 0)),
        new Player(11, new Vector2D(INITIAL_X + 9 * 800, 0)),
    ];
}

export function getPlayerInitialPosition(number: number): Vector2D {
    return new Vector2D(INITIAL_X + (number - 2) * 800, 0);
}

export function getDefaultInitialPositions(): TeamPositions {
    return {
        1: { col: 0, row: 0 },
        2: { col: null, row: null },
        3: { col: null, row: null },
        4: { col: null, row: null },
        5: { col: null, row: null },
        6: { col: null, row: null },
        7: { col: null, row: null },
        8: { col: null, row: null },
        9: { col: null, row: null },
        10: { col: null, row: null },
        11: { col: null, row: null },
    };
}
