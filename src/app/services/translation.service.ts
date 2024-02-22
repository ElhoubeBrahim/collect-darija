import { Injectable } from "@angular/core";
import { Sentence } from "../models/sentences.model";
import { AuthenticationService } from "./authentication.service";
import { ToastrService } from "ngx-toastr";
import { Translation } from "../models/translations.model";
import { Timestamp } from "@firebase/firestore";
import {
  Firestore,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  runTransaction,
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
    // Get logged in user
    const user = await this.authentication.getCurrentUser();
    if (!user) {
      this.toastr.error("Please login to translate sentences!");
      return;
    }

    // Create a new translation
    const translationData: Translation = {
      id: doc(collection(this.firestore, "translations")).id, // Generate a new id
      userId: user.id,
      sentence: {
        id: sentence.id,
        content: sentence.content,
      },
      translation,
      translatedAt: Timestamp.fromDate(new Date()),
    };

    await runTransaction(this.firestore, async (transaction) => {
      // Save the translation
      const translationDoc = doc(
        this.firestore,
        "translations",
        translationData.id,
      );
      transaction.set(translationDoc, translationData);

      // Update the sentence translations count
      const sentenceDoc = doc(this.firestore, "sentences", sentence.id);
      transaction.update(sentenceDoc, {
        translationsCount: increment(1),
      });

      // Update user translations count & score
      const userDoc = doc(this.firestore, "users", user.id);
      transaction.update(userDoc, {
        "stats.translations": increment(1),
        score: increment(10),
        scoreUpdatedAt: Timestamp.fromDate(new Date()),
      });
    });
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
