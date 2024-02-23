import { Component, OnInit } from "@angular/core";
import { HistoryTableComponent } from "../../components/history-table/history-table.component";
import { TranslationService } from "../../services/translation.service";
import { Translation } from "../../models/translations.model";
import { LoadingComponent } from "../../components/loading/loading.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [HistoryTableComponent, LoadingComponent],
  templateUrl: "./history.component.html",
})
export class HistoryComponent implements OnInit {
  history: Translation[] = [];
  loading = true;

  constructor(private translation: TranslationService) {}

  async ngOnInit() {
    this.history = await this.translation.getTranslationsHistory();
    this.loading = false;
  }
}
