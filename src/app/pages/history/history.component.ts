import { Component, OnInit } from "@angular/core";
import { HistoryTableComponent } from "../../components/history-table/history-table.component";
import { TranslationService } from "../../services/translation.service";
import { Translation } from "../../models/translations.model";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [HistoryTableComponent],
  templateUrl: "./history.component.html",
})
export class HistoryComponent implements OnInit {
  public history: Translation[] = [];

  constructor(private translation: TranslationService) {}

  async ngOnInit() {
    this.history = await this.translation.getTranslationsHistory();
  }
}
