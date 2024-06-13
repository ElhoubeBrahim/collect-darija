import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Translation } from "../models/translations.model";
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReviewService {
  constructor(private http: HttpClient) {}

  async submitReview(
    translation: Translation,
    rating: number,
    comment: string,
  ) {
    const observable$ = this.http.post("/review", {
      translationId: translation.id,
      rating: rating,
      comment: comment,
    });
    await lastValueFrom(observable$);
  }
}
