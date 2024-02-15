import { Component } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { HistoryModalContentComponent } from "../history-modal-content/history-modal-content.component";

@Component({
  selector: "app-history-table",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, HistoryModalContentComponent],
  templateUrl: "./history-table.component.html",
})
export class HistoryTableComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(HistoryModalContentComponent, {
      maxWidth: "98vw",
    });
  }
}
