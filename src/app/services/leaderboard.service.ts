import { Injectable } from "@angular/core";
import { UserWithRanking } from "../models/users.model";
import { lastValueFrom } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { Translation } from "../models/translations.model";
import { Firestore } from "@angular/fire/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  constructor(
    private firestore: Firestore,
    private authentication: AuthenticationService,
    private http: HttpClient,
  ) {}

  async getLeaderboard(): Promise<UserWithRanking[]> {
    const observable$ = this.http.get("/leaderboard");
    const data = (await lastValueFrom(observable$)) as {
      leaderboard: UserWithRanking[];
    };

    return data.leaderboard;
  }

  async getWeeklyContributions(): Promise<{ day: Date; value: number }[]> {
    // Get the current user
    const user = await this.authentication.getCurrentUser();
    if (!user) return [];

    // Get the current date
    const now = new Date();
    const range = [
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    ];

    // Get the translations
    const translationsCollection = collection(this.firestore, "translations");
    const q = query(
      translationsCollection,
      where("userId", "==", user.id),
      where("translatedAt", ">=", range[0]),
      where(
        "translatedAt",
        "<=",
        new Date(range[1].getTime() + 24 * 60 * 60 * 1000),
      ),
    );
    const translationsSnapshot = await getDocs(q);
    const translations = translationsSnapshot.docs;

    // Count contributions
    const contributions = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i,
      );
      contributions.push({
        day: date,
        value: translations.filter((translation) => {
          const t = translation.data() as Translation;
          return t.translatedAt.toDate().toDateString() === date.toDateString();
        }).length,
      });
    }

    return contributions.reverse();
  }
}
