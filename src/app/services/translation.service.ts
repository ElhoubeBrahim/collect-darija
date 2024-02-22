import { Injectable } from "@angular/core";
import { Sentence } from "../models/sentences.model";
import { AuthenticationService } from "./authentication.service";
import { ToastrService } from "ngx-toastr";
import { Translation } from "../models/translations.model";
import {
  Firestore,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "@angular/fire/firestore";
import { HttpClient } from "@angular/common/http";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(
    private firestore: Firestore,
    private authentication: AuthenticationService,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {}

  async getSentenceToTranslate(): Promise<Sentence | null> {
    const observable$ = this.http.get("/sentence");
    const data = (await lastValueFrom(observable$)) as {
      sentence: Sentence | null;
    };

    return data.sentence;
  }

  async translateSentence(sentence: Sentence, translation: string) {
    const observable$ = this.http.post("/translate", {
      sentenceId: sentence.id,
      translation,
    });
    await lastValueFrom(observable$); // To make the request
  }

  async getTranslationsHistory(count = 10): Promise<Translation[]> {
    const user = await this.authentication.getCurrentUser();
    if (!user) {
      this.toastr.error("Please login to view translations history!");
      return [];
    }

    const translationsCollection = collection(this.firestore, "translations");
    const q = query(
      translationsCollection,
      where("userId", "==", user.id),
      orderBy("translatedAt", "desc"),
      limit(count),
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Translation);
  }
}
