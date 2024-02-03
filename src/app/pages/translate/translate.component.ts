import { Component } from "@angular/core";
import { Sentence } from "../../models/sentences.model";
import { ToastrService } from "ngx-toastr";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-translate",
  standalone: true,
  imports: [],
  templateUrl: "./translate.component.html",
})
export class TranslateComponent {
  sentence: Sentence | null = null;
  translation: string = "";

  flags = {
    showPlaceholder: true,
    loading: false,
    TRANSLATION_LIMIT: 1000,
  };

  constructor(
    private toastr: ToastrService,
    private translate: TranslationService,
  ) {
    this.flags.showPlaceholder = this.translation.length == 0;
    this.loadNewSentence();
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

  initializeTranslationData() {
    this.sentence = null;
    this.translation = "";
    this.flags.showPlaceholder = this.translation.length == 0;
  }

  async loadNewSentence() {
    this.initializeTranslationData();
    const sentence = await this.translate.getSentenceToTranslate();
    sentence
      ? (this.sentence = sentence)
      : this.toastr.info("No sentences to translate at the moment.");
  }

  async submitTranslation() {
    // Validate the translation data
    if (this.translation.length == 0 || this.limitReached()) {
      this.toastr.error(
        "Ooops! Please provide a valid translation within the limits.",
      );
      return;
    }

    // Disable the submit button
    this.flags.loading = true;

    // Submit the translation
    if (this.sentence) {
      await this.translate.translateSentence(this.sentence, this.translation);
    }

    // Enable the submit button
    this.flags.loading = false;

    // Load the next sentence
    this.toastr.success(
      "Translation submitted successfully! Thanks for your contribution.",
    );
    this.loadNewSentence();
  }

  limitReached() {
    return this.translation.length >= this.flags.TRANSLATION_LIMIT;
  }
}
