import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LeaderboardState } from "./leaderboard.reducer";
import { UserWithRanking } from "../../models/users.model";

export const leaderboardSelector = createSelector(
  createFeatureSelector<LeaderboardState>("leaderboard"),
  (state: LeaderboardState) => state.leaderboard,
);

export const top3Selector = createSelector(
  leaderboardSelector,
  (leaderboard: UserWithRanking[]) => leaderboard.slice(0, 3),
);

export const restOfLeaderboardSelector = createSelector(
  leaderboardSelector,
  (leaderboard: UserWithRanking[]) => leaderboard.slice(3),
);

export const leaderboardLoadedSelector = createSelector(
  createFeatureSelector<LeaderboardState>("leaderboard"),
  (state: LeaderboardState) => state.loaded,
);
