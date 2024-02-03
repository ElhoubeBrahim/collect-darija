import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Sentence } from "../models/sentences.model";
import { firstValueFrom } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { ToastrService } from "ngx-toastr";
import { Translation } from "../models/translations.model";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  constructor(
    private firestore: AngularFirestore,
    private authentication: AuthenticationService,
    private toastr: ToastrService,
  ) {}

  async getSentenceToTranslate(): Promise<Sentence | null> {
    const sentence$ = this.firestore
      .collection<Sentence>(
        "sentences",
        (ref) => ref.orderBy("translationsCount", "asc").limit(10), // Limit to 10 sentences per query
      )
      .get();

    const result = await firstValueFrom(sentence$);
    const sentences = result.docs
      .map((doc) => doc.data()) // Get the sentences data from the documents
      .sort(() => Math.random() - 0.5); // Shuffle the sentences

    // Return the first sentence
    return sentences.length > 0 ? sentences[0] : null;
  }

  async findSentenceById(sentenceId: string): Promise<Sentence | null> {
    const sentence$ = this.firestore
      .collection("sentences")
      .doc(sentenceId)
      .get();
    const result = await firstValueFrom(sentence$);
    return result.data() as Sentence;
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
      id: this.firestore.createId(),
      userId: user.id,
      sentenceId: sentence.id,
      translation,
      translatedAt: new Date(),
    };

    // Save the translation
    await this.firestore
      .collection("translations")
      .doc(translationData.id)
      .set(translationData);

    // Update the sentence translations count
    await this.firestore
      .collection("sentences")
      .doc(sentence.id)
      .update({ translationsCount: sentence.translationsCount + 1 });

    // Update user translations count & score
    await this.authentication.updateUser({
      ...user,
      translationsCount: user.translationsCount + 1,
      score: user.score + 10,
    });
  }
}
