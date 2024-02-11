import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { AsyncPipe } from "@angular/common";
import { PodiumComponent } from "../../components/podium/podium.component";
import { LeaderboardTableComponent } from "../../components/leaderboard-table/leaderboard-table.component";
import { setLeaderboard } from "../../store/leaderboard/leaderboard.actions";
import { LeaderboardService } from "../../services/leaderboard.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe, PodiumComponent, LeaderboardTableComponent],
  templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent {
  constructor(
    private store: Store,
    private leaderboard: LeaderboardService,
  ) {
    this.leaderboard.getLeaderboard().subscribe((users) => {
      this.leaderboard.setupLeaderboard(users).then((leaderboard) => {
        this.store.dispatch(setLeaderboard(leaderboard));
      });
    });
  }
}
