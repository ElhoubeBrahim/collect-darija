import { Injectable } from "@angular/core";
import { UserWithRanking } from "../models/users.model";
import { lastValueFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LeaderboardService {
  constructor(private http: HttpClient) {}

  async getLeaderboard(): Promise<UserWithRanking[]> {
    const observable$ = this.http.get("/leaderboard");
    const data = (await lastValueFrom(observable$)) as {
      leaderboard: UserWithRanking[];
    };

    return data.leaderboard;
  }

  async getWeeklyContributions(): Promise<{ day: Date; value: number }[]> {
    const observable$ = this.http.get("/weekly-contributions");
    const data = (await lastValueFrom(observable$)) as {
      day: Date;
      value: number;
    }[];

    return data;
  }
}
