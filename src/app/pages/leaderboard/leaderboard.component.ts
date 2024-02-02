import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AuthenticationService } from "../../services/authentication.service";
import { AsyncPipe } from "@angular/common";
import { PodiumComponent } from "../../components/podium/podium.component";
import { LeaderboardTableComponent } from "../../components/leaderboard-table/leaderboard-table.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe, PodiumComponent, LeaderboardTableComponent],
  templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent {
  user$ = this.store.pipe(select(userSelector));

  constructor(
    private store: Store,
    private authentication: AuthenticationService,
  ) {}
}
