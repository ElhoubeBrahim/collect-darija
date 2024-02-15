import { NgStyle } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-home-card",
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: "./home-card.component.html",
})
export class HomeCardComponent {
  @Input() color: string = "#F39C12";
  @Input() icon: string = "ri ri-translate";
  @Input() title: string = "Card Title";
  @Input() number: number = 0;
  @Input() link: string = "/";
}
