import { Component } from "@angular/core";
import { TranslationService } from "../../services/translation.service";
import { NoDataComponent } from "../../components/no-data/no-data.component";
import { LoadingComponent } from "../../components/loading/loading.component";
import { Translation } from "../../models/translations.model";
import { CommonModule } from "@angular/common";
import { ReviewService } from "../../services/review.service";
import { ToastrService } from "ngx-toastr";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-validate",
  standalone: true,
  imports: [NoDataComponent, LoadingComponent, CommonModule, FormsModule],
  templateUrl: "./validate.component.html",
})
export class ValidateComponent {
  translation: Translation | null = null;
  ratings = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  comment: string = "";

  flags = {
    noTranslations: false,
  };

  constructor(
    private translate: TranslationService,
    private review: ReviewService,
    private toastr: ToastrService,
  ) {
    this.loadNewTranslation();
  }

  async loadNewTranslation() {
    const transaction = await this.translate.getoTranslationToValidate();
    if (!transaction) {
      this.flags.noTranslations = true;
      return;
    }
    this.translation = transaction;
    this.selectedRating = 0;
    this.comment = "";
  }
  setRating(rating: number) {
    this.selectedRating = rating;
  }

  async submitReview() {
    if (this.translation) {
      await this.review.submitReview(
        this.translation,
        this.selectedRating,
        this.comment,
      );
    }

    this.toastr.success(
      "Review submitted successfully! Thanks for your contribution.",
    );
    this.loadNewTranslation();
  }
}
