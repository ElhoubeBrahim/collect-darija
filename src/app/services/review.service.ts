import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Translation } from "../models/translations.model";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  async submitReview(translation: Translation, rating: number) {
    const observable$ = this.http.post("/review", {
      translationId: translation.id,
      rating: rating,
    });
    await lastValueFrom(observable$);
  }
}
