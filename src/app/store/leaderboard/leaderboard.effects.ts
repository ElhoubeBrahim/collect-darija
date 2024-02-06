import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LeaderboardService } from "../../services/leaderboard.service";
import { LEADERBOARD_LOAD, setLeaderboard } from "./leaderboard.actions";
import { map, switchMap } from "rxjs";
import { AUTH_LOGIN } from "../authentication/authentication.actions";

@Injectable()
export class LeaderboardEffects {
  constructor(
    private actions$: Actions,
    private leaderboardService: LeaderboardService,
  ) {}

  loadLeaderboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LEADERBOARD_LOAD),
      switchMap(() => this.leaderboardService.loadLeaderboard()),
      map((users) => setLeaderboard(users)),
    ),
  );

  loadLeaderboardAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AUTH_LOGIN),
      map(() => ({ type: LEADERBOARD_LOAD })),
    ),
  );
}
