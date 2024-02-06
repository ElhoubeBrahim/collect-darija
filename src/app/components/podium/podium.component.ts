import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { top3Selector } from "../../store/leaderboard/leaderboard.selector";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-podium",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./podium.component.html",
})
export class PodiumComponent {
  users$ = this.store.select(top3Selector);

  constructor(private store: Store) {}
}
