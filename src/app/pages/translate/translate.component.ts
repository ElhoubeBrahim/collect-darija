import { Component } from "@angular/core";
import { Sentence } from "../../models/sentences.model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-translate",
  standalone: true,
  imports: [],
  templateUrl: "./translate.component.html",
})
export class TranslateComponent {
  sentence: Sentence = {
    id: "1",
    content:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    translationsCount: 0,
  };
  translation: string = "";

  flags = {
    showPlaceholder: true,
    loading: false,
    TRANSLATION_LIMIT: 1000,
  };

  constructor(private toastr: ToastrService) {
    this.flags.showPlaceholder = this.translation.length == 0;
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

  updateTranslation(event: Event) {
    this.translation = (event.target as Element).textContent || "";
    this.flags.showPlaceholder = this.translation.length == 0;
  }

  submitTranslation() {
    if (this.translation.length == 0 || this.limitReached()) {
      this.toastr.error(
        "Ooops! Please provide a valid translation within the limits.",
      );
      return;
    }

    this.flags.loading = true;
    console.log("Submitted translation: ", this.translation);
    this.flags.loading = false;
  }

  limitReached() {
    return this.translation.length >= this.flags.TRANSLATION_LIMIT;
  }
}
