import { Injectable } from "@angular/core";
import { User, UserWithRanking } from "../models/users.model";
import { Observable, lastValueFrom } from "rxjs";
import { AuthenticationService } from "./authentication.service";
import { Translation } from "../models/translations.model";
import { Firestore } from "@angular/fire/firestore";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  private LEADERBOARD_SIZE = 10;
  private MAX_DOCUMENTS = 1000;

  constructor(
    private firestore: Firestore,
    private authentication: AuthenticationService,
  ) {}

  getLeaderboard(): Observable<User[]> {
    return new Observable((observer) => {
      // Get the users collection
      const usersCollection = collection(this.firestore, "users");

      // Get the users ordered by score
      const q = query(
        usersCollection,
        orderBy("score", "desc"),
        orderBy("scoreUpdatedAt", "asc"),
        limit(this.LEADERBOARD_SIZE),
        where("score", ">", 0),
      );

      // Subscribe to the users collection
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const leaderboard = querySnapshot.docs.map((doc) =>
          doc.data(),
        ) as User[];
        observer.next(leaderboard);
      });

      return () => unsubscribe();
    });
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
      const ranking = await this.getUserRanking(user);
      // Add the current user to the leaderboard
      ranking > this.LEADERBOARD_SIZE && leaderboard.push({ ...user, ranking });
    }

    // Return the leaderboard
    return leaderboard;
  }

  async getUserRanking(user: User): Promise<number> {
    // Check current user's score
    if (!user || user.score == 0) return 0;

    // Get all users with a score higher or equal to the current user
    const usersCollection = collection(this.firestore, "users");
    const q = query(
      usersCollection,
      orderBy("score", "desc"),
      orderBy("scoreUpdatedAt", "asc"),
      where("score", ">=", user.score),
      limit(this.MAX_DOCUMENTS),
    );
    const usersSnapshot = await getDocs(q);

    // Return the current user's ranking
    return usersSnapshot.docs.findIndex((u) => u.id === user.id) + 1;
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
