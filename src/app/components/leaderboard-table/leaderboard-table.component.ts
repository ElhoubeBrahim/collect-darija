import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { restOfLeaderboardSelector } from "../../store/leaderboard/leaderboard.selector";
import { AsyncPipe, NgClass } from "@angular/common";
import { User } from "../../models/users.model";
import { userSelector } from "../../store/authentication/authentication.selector";

@Component({
  selector: "app-leaderboard-table",
  standalone: true,
  imports: [AsyncPipe, NgClass],
  templateUrl: "./leaderboard-table.component.html",
})
export class LeaderboardTableComponent {
  users$ = this.store.select(restOfLeaderboardSelector);
  currentUser: User | null = null;

  constructor(private store: Store) {
    this.store.select(userSelector).subscribe((user) => {
      this.currentUser = user;
    });
  }
}
