import { Vector2D } from "@mauricioroberto/math-world";

export const FIELD_WIDTH = 20000;
export const FIELD_HEIGHT = 10000;

export const GOAL_RADIUS = 1400;

export const HOME_GOAL_TOP = new Vector2D(0, 6500);
export const HOME_GOAL_CENTER = new Vector2D(0, 5000);
export const HOME_GOAL_BOTTOM = new Vector2D(0, 3500);

export const AWAY_GOAL_TOP = new Vector2D(FIELD_WIDTH, 6500);
export const AWAY_GOAL_CENTER = new Vector2D(FIELD_WIDTH, 5000);
export const AWAY_GOAL_BOTTOM = new Vector2D(FIELD_WIDTH, 3500);

export const FIELD_POINT_1 = new Vector2D(0, 0);
export const FIELD_POINT_2 = new Vector2D(FIELD_WIDTH, 0);
export const FIELD_POINT_3 = new Vector2D(FIELD_WIDTH, FIELD_HEIGHT);
export const FIELD_POINT_4 = new Vector2D(0, FIELD_HEIGHT);

export const FIELD_POINT_CENTER = new Vector2D(FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
