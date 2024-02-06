import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AsyncPipe } from "@angular/common";
import { PodiumComponent } from "../../components/podium/podium.component";
import { LeaderboardTableComponent } from "../../components/leaderboard-table/leaderboard-table.component";
import { leaderboardLoadedSelector } from "../../store/leaderboard/leaderboard.selector";
import { loadLeaderboard } from "../../store/leaderboard/leaderboard.actions";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe, PodiumComponent, LeaderboardTableComponent],
  templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent {
  private leaderboardLoaded$ = this.store.select(leaderboardLoadedSelector);

  constructor(private store: Store) {
    this.leaderboardLoaded$.subscribe((loaded) => {
      if (!loaded) {
        this.store.dispatch(loadLeaderboard());
      }
    });
  }
}
