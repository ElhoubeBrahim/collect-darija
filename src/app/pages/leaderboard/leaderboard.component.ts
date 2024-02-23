import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { AsyncPipe } from "@angular/common";
import { PodiumComponent } from "../../components/podium/podium.component";
import { LeaderboardTableComponent } from "../../components/leaderboard-table/leaderboard-table.component";
import { setLeaderboard } from "../../store/leaderboard/leaderboard.actions";
import { LeaderboardService } from "../../services/leaderboard.service";
import { leaderboardLoadedSelector } from "../../store/leaderboard/leaderboard.selector";
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    AsyncPipe,
    PodiumComponent,
    LeaderboardTableComponent,
    LoadingComponent,
  ],
  templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent {
  leaderboardLoaded$ = this.store.pipe(select(leaderboardLoadedSelector));
  loading = true;

  constructor(
    private store: Store,
    private leaderboard: LeaderboardService,
  ) {
    // Subscribe to the leaderboard data if the leaderboard is not loaded
    this.leaderboardLoaded$.subscribe((loaded) => {
      if (!loaded) {
        this.leaderboard.getLeaderboard().then((leaderboard) => {
          // Update the leaderboard (store)
          this.store.dispatch(setLeaderboard(leaderboard));
          this.loading = false;
        });
      }
    });
  }
}
