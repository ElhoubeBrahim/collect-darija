import { Injectable } from "@angular/core";
import { Sentence } from "../models/sentences.model";
import { Translation } from "../models/translations.model";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";
import { Timestamp } from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(private http: HttpClient) {}

  async getSentenceToTranslate(): Promise<Sentence | null> {
    const observable$ = this.http.get("/sentence");
    const data = (await lastValueFrom(observable$)) as {
      sentence: Sentence | null;
    };

    return data.sentence;
  }

  async getoTranslationToValidate(): Promise<Translation | null> {
    const observable$ = this.http.get("/translation");
    const data = (await lastValueFrom(observable$)) as {
      translation: Translation | null;
    };

    return data.translation;
  }

  async translateSentence(sentence: Sentence, translation: string) {
    const observable$ = this.http.post("/translate", {
      sentenceId: sentence.id,
      translation,
    });
    await lastValueFrom(observable$); // To make the request
  }

  async getTranslationsHistory(): Promise<Translation[]> {
    const observable$ = this.http.get("/history");
    const data = (await lastValueFrom(observable$)) as Translation[];

    return data.map((translation) => {
      return {
        ...translation,
        translatedAt: new Timestamp(
          translation.translatedAt.seconds,
          translation.translatedAt.nanoseconds,
        ),
      };
    });
  }
}
