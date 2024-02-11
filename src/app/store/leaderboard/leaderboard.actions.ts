import { createAction } from "@ngrx/store";
import { UserWithRanking } from "../../models/users.model";

export const LEADERBOARD_SET = "[Leaderboard] Set";

export const setLeaderboard = createAction(
  LEADERBOARD_SET,
  (data: UserWithRanking[]) => ({
    data,
  }),
);
