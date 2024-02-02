import { Component } from "@angular/core";

interface users {
  name: string;
  image: string;
  score: number;
  translations: number;
  audio: number;
}

@Component({
  selector: "app-leaderboard-table",
  standalone: true,
  imports: [],
  templateUrl: "./leaderboard-table.component.html",
})
export class LeaderboardTableComponent {
  users = [
    {
      name: "John",
      image: "../../../assets/user2.jpg",
      score: 100,
      translations: 10,
      audio: 25,
    },
    {
      name: "Jane",
      image: "../../../assets/user2.jpg",
      score: 90,
      translations: 8,
      audio: 20,
    },
    {
      name: "Doe",
      image: "../../../assets/user3.jpg",
      score: 80,
      translations: 6,
      audio: 15,
    },
    {
      name: "Doe",
      image: "../../../assets/user3.jpg",
      score: 80,
      translations: 6,
      audio: 15,
    },
    {
      name: "Doe",
      image: "../../../assets/user3.jpg",
      score: 80,
      translations: 6,
      audio: 15,
    },
  ];

  constructor() {
    this.users = this.users.sort((a, b) => b.score - a.score);
  }
}
