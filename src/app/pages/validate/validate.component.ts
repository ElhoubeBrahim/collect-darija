import { Component } from "@angular/core";
import { TranslationService } from "../../services/translation.service";
import { NoDataComponent } from "../../components/no-data/no-data.component";
import { LoadingComponent } from "../../components/loading/loading.component";
import { Translation } from "../../models/translations.model";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-validate",
  standalone: true,
  imports: [NoDataComponent, LoadingComponent, CommonModule],
  templateUrl: "./validate.component.html",
})
export class ValidateComponent {
  translation: Translation | null = null;
  ratings = [1, 2, 3, 4, 5];
  selectedRating: number = 0;

  flags = {
    loading: false,
    noTranslations: false,
  };

  constructor(private translate: TranslationService) {
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
  }
  validate() {}

  setRating(rating: number) {
    this.selectedRating = rating;
  }
}
