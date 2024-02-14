import { Component } from "@angular/core";
import { HistoryTableComponent } from "../../components/history-table/history-table.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [HistoryTableComponent],
  templateUrl: "./history.component.html",
})
export class HistoryComponent {
  constructor() {}
}
