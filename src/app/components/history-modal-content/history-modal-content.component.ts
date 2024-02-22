import { Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { Translation } from "../../models/translations.model";
import dayjs from "dayjs";

@Component({
  selector: "app-history-modal-content",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: "./history-modal-content.component.html",
})
export class HistoryModalContentComponent {
  public translation: Translation | null = null;

  rating: number = 3.5;

  fullStars: number;
  emptyStars: number;
  hasHalfStar: boolean;

  constructor() {
    this.fullStars = Math.floor(this.rating) - 1;
    this.hasHalfStar = this.rating - this.fullStars >= 0.5;
    this.emptyStars = 5 - Math.ceil(this.rating);
  }

  async copyToClipboard(event: Event, text: string) {
    // Create a temporary input element
    const input = document.createElement("input");
    input.value = text;
    input.style.position = "absolute";
    input.style.left = "-9999px";
    document.body.appendChild(input);

    // Copy the text from the input
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    // Toggle copy icon
    const iconElement = event.target as Element;
    iconElement.classList.add("ri-check-line");
    iconElement.classList.remove("ri-file-copy-line");
    setTimeout(() => {
      iconElement.classList.remove("ri-check-line");
      iconElement.classList.add("ri-file-copy-line");
    }, 2000);
  }

  showDate() {
    if (!this.translation) {
      return "";
    }

    const date = this.translation.translatedAt.toDate();
    return dayjs(date).format("DD-MM-YYYY HH:mm");
  }
}
