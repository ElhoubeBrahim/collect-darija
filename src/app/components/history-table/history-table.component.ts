import { Component, Input } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { HistoryModalContentComponent } from "../history-modal-content/history-modal-content.component";
import { Translation } from "../../models/translations.model";

@Component({
  selector: "app-history-table",
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, HistoryModalContentComponent],
  templateUrl: "./history-table.component.html",
})
export class HistoryTableComponent {
  @Input() history: Translation[] = [];

  constructor(public dialog: MatDialog) {}

  openDialog(translation: Translation) {
    const dialogRef = this.dialog.open(HistoryModalContentComponent, {
      maxWidth: "98vw",
    });

    dialogRef.componentInstance.translation = translation;
  }
}
