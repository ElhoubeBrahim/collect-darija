import { Component } from "@angular/core";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-history-modal-content",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: "./history-modal-content.component.html",
})
export class HistoryModalContentComponent {
  rating: number = 3.5;

  fullStars: number;
  emptyStars: number;
  hasHalfStar: boolean;

  constructor() {
    this.fullStars = Math.floor(this.rating) - 1;
    this.hasHalfStar = this.rating - this.fullStars >= 0.5;
    this.emptyStars = 5 - Math.ceil(this.rating);
  }
}
