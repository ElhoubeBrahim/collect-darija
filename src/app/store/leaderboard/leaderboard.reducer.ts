import { createReducer, on } from "@ngrx/store";
import { UserWithRanking } from "../../models/users.model";
import { setLeaderboard } from "./leaderboard.actions";

export interface LeaderboardState {
  leaderboard: UserWithRanking[];
  loaded: boolean;
}

const initalState: LeaderboardState = {
  leaderboard: [],
  loaded: false,
};

export const leaderboardReducer = createReducer(
  initalState,
  on(setLeaderboard, (state, { data }) => ({
    leaderboard: data,
    loaded: true,
  })),
);
