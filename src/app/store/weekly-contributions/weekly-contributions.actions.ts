import { createAction } from "@ngrx/store";

export const WEEKLY_CONTRIBUTIONS_SET =
  "[Leaderboard] Weekly Contributions Set";

export const setWeeklyContributions = createAction(
  WEEKLY_CONTRIBUTIONS_SET,
  (data: { day: string; value: number }[]) => ({
    data,
  }),
);
