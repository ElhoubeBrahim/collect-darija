import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { User, UserWithRanking } from "../models/users.model";
import { lastValueFrom } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  private LEADERBOARD_SIZE = 10;

  constructor(
    private firestore: AngularFirestore,
    private authentication: AuthenticationService,
  ) {}

  async loadLeaderboard(): Promise<UserWithRanking[]> {
    // Select users from the database ordered by score
    // and limit the results to 10
    const users$ = this.firestore
      .collection("users", (ref) =>
        ref
          .orderBy("score", "desc")
          .orderBy("scoreUpdatedAt", "asc")
          .limit(this.LEADERBOARD_SIZE)
          .where("score", ">", 0),
      )
      .get()
      .pipe();
    const users = await lastValueFrom(users$);

    // Get the users
    const leaderboard = users.docs.map((doc, index) => ({
      ...(doc.data() as User),
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
}
