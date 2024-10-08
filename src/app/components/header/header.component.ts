import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AsyncPipe, JsonPipe } from "@angular/common";
import { RouterLink, Router, NavigationEnd } from "@angular/router";
import { AuthenticationService } from "../../services/authentication.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [AsyncPipe, JsonPipe, RouterLink],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  user$ = this.store.pipe(select(userSelector));
  dropdown = {
    open: false,
    links: [
      { icon: "home-7-line", label: "Home", route: "/home" },
      { icon: "translate", label: "Translate", route: "/translate" },
      { icon: "checkbox-multiple-line", label: "Validate", route: "/validate" },
      { icon: "history-line", label: "History", route: "/history" },
      { icon: "trophy-line", label: "Leaderboard", route: "/leaderboard" },
    ],
  };
  currentRoute: string = "";

  constructor(
    private store: Store,
    private authentication: AuthenticationService,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  async logout() {
    if (confirm("Are you sure you want to log out?") === false) return;
    await this.authentication.logout();
  }

  toggleDropdown() {
    this.dropdown.open = !this.dropdown.open;
  }
}
