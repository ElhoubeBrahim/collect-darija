import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LeaderboardService } from "../../services/leaderboard.service";
import { map, switchMap } from "rxjs";
import { AUTH_LOGIN } from "../authentication/authentication.actions";
import {
  WEEKLY_CONTRIBUTIONS_LOAD,
  setWeeklyContributions,
} from "./weekly-contributions.actions";

@Injectable()
export class WeeklyContributionsEffects {
  constructor(
    private actions$: Actions,
    private leaderboardService: LeaderboardService,
  ) {}

  loadLeaderboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WEEKLY_CONTRIBUTIONS_LOAD),
      switchMap(() => this.leaderboardService.getWeeklyContributions()),
      map((data) => setWeeklyContributions(data)),
    ),
  );

  loadLeaderboardAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTH_LOGIN),
      map(() => ({ type: WEEKLY_CONTRIBUTIONS_LOAD })),
    ),
  );
}
