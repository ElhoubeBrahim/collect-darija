import { Component } from "@angular/core";

interface User {
  name: string;
  points: number;
  image: string;
}

@Component({
  selector: "app-podium",
  standalone: true,
  imports: [],
  templateUrl: "./podium.component.html",
})
export class PodiumComponent {
  users = [
    { name: "Emma Aria", points: 1674, image: "../../../assets/user.png" },
    {
      name: "Brahim Elhoube",
      points: 1847,
      image: "../../../assets/user2.jpg",
    },
    { name: "Eiden", points: 2430, image: "../../../assets/user3.jpg" },
  ];

  constructor() {
    this.users.sort((a, b) => b.points - a.points);
    console.log(this.users);
  }
}
