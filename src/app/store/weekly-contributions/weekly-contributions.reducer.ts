import { createReducer, on } from "@ngrx/store";
import { setWeeklyContributions } from "./weekly-contributions.actions";

export interface WeeklyContributionsState {
  data: { day: Date; value: number }[];
  loaded: boolean;
}

const initalState: WeeklyContributionsState = {
  data: [],
  loaded: false,
};

export const weeklyContributionsReducer = createReducer(
  initalState,
  on(setWeeklyContributions, (state, { data }) => ({
    data,
    loaded: true,
  })),
);
