import { createFeatureSelector, createSelector } from "@ngrx/store";
import { WeeklyContributionsState } from "./weekly-contributions.reducer";

export const weeklyContributionsSelector = createSelector(
  createFeatureSelector<WeeklyContributionsState>("weekly-contributions"),
  (state: WeeklyContributionsState) => state.data,
);

export const weeklyContributionsLoadedSelector = createSelector(
  createFeatureSelector<WeeklyContributionsState>("weekly-contributions"),
  (state: WeeklyContributionsState) => state.loaded,
);
