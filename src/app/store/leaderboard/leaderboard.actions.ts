import { createAction } from "@ngrx/store";
import { UserWithRanking } from "../../models/users.model";

export const LEADERBOARD_LOAD = "[Leaderboard] Load";
export const LEADERBOARD_RESET = "[Leaderboard] Reset";
export const LEADERBOARD_SET = "[Leaderboard] Set";

export const loadLeaderboard = createAction(LEADERBOARD_LOAD);
export const setLeaderboard = createAction(
  LEADERBOARD_SET,
  (data: UserWithRanking[]) => ({
    data,
  }),
);
