import { createAction } from "@ngrx/store";

export const WEEKLY_CONTRIBUTIONS_LOAD =
  "[Leaderboard] Weekly Contributions Load";
export const WEEKLY_CONTRIBUTIONS_SET =
  "[Leaderboard] Weekly Contributions Set";

export const loadWeeklyContributions = createAction(WEEKLY_CONTRIBUTIONS_LOAD);
export const setWeeklyContributions = createAction(
  WEEKLY_CONTRIBUTIONS_SET,
  (data: { day: Date; value: number }[]) => ({
    data,
  }),
);
