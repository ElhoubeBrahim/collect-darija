import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User, UserWithRanking } from "../models/users.model";
import { Observable, lastValueFrom } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { ToastrService } from "ngx-toastr";
import { Translation } from "../models/translations.model";

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  private LEADERBOARD_SIZE = 10;

  constructor(
    private firestore: AngularFirestore,
    private authentication: AuthenticationService,
  ) {}

  getLeaderboard(): Observable<User[]> {
    return this.firestore
      .collection<User>("users", (ref) =>
        ref
          .orderBy("score", "desc")
          .orderBy("scoreUpdatedAt", "asc")
          .limit(this.LEADERBOARD_SIZE)
          .where("score", ">", 0),
      )
      .valueChanges();
  }

  async setupLeaderboard(users: User[]): Promise<UserWithRanking[]> {
    // Get the users with their ranking
    const leaderboard = users.map((user, index) => ({
      ...user,
      ranking: index + 1,
    }));

    // Get the current user
    const user = await this.authentication.getCurrentUser();
    // If the current user is not in the leaderboard
    if (user && user.score > 0 && !leaderboard.find((u) => u.id === user.id)) {
      // Get the current user's ranking
      const ranking = await this.getCurrentUserRanking();
      // Add the current user to the leaderboard
      ranking > this.LEADERBOARD_SIZE && leaderboard.push({ ...user, ranking });
    }

    // Return the leaderboard
    return leaderboard;
  }

  async getCurrentUserRanking(): Promise<number> {
    // Get current user
    const user = await this.authentication.getCurrentUser();
    if (!user || user.score == 0) {
      return 0;
    }

    // Get users with a higher score
    const users$ = this.firestore
      .collection("users", (ref) =>
        ref
          .orderBy("score", "desc")
          .orderBy("scoreUpdatedAt", "asc")
          .where("score", ">=", user.score),
      )
      .get()
      .pipe();

    // Return the number of users with a higher score
    const users = await lastValueFrom(users$);
    return users.docs.findIndex((u) => u.id === user.id) + 1;
  }

  async getWeeklyContributions(): Promise<{ day: Date; value: number }[]> {
    console.log("getWeeklyContributions");
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
    const translations$ = this.firestore
      .collection<Translation>("translations", (ref) =>
        ref
          .where("userId", "==", user.id)
          .where("translatedAt", ">=", range[0])
          .where(
            "translatedAt",
            "<=",
            new Date(range[1].getTime() + 24 * 60 * 60 * 1000),
          ),
      )
      .get();
    const translations = await lastValueFrom(translations$);

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
        value: translations.docs.filter(
          (t) =>
            t.data().translatedAt.toDate().toDateString() ===
            date.toDateString(),
        ).length,
      });
    }

    return contributions.reverse();
  }
}
