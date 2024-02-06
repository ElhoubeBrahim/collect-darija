import { createAction } from "@ngrx/store";
import { UserWithRanking } from "../../models/users.model";

export const LEADERBOARD_LOAD = "[Leaderboard] Load";
export const LEADERBOARD_SET = "[Leaderboard] Set";
export const LEADERBOARD_SET_CURRENT_USER_RANK =
  "[Leaderboard] Set Current User Rank";

export const loadLeaderboard = createAction(LEADERBOARD_LOAD);
export const setLeaderboard = createAction(
  LEADERBOARD_SET,
  (data: UserWithRanking[]) => ({
    data,
  }),
);
