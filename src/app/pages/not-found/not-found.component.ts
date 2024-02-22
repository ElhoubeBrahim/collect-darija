import { Component } from "@angular/core";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: "./not-found.component.html",
})
export class NotFoundComponent {}
