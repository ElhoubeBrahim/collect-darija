import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { Store } from "@ngrx/store";
import { logout, setUser } from "./store/authentication/authentication.actions";
import { Auth } from "@angular/fire/auth";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  title = "collect-darija";

  constructor(
    private auth: Auth,
    private authentication: AuthenticationService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.auth.onAuthStateChanged(async (user) => {
      if (!user) {
        this.store.dispatch(logout());
        localStorage.removeItem("accessToken");
        return;
      }

      // Save access token in local storage
      const accessToken = await user.getIdToken();
      localStorage.setItem("accessToken", accessToken);

      // Save user data in the store
      this.authentication.getUser$(user.uid).subscribe((data) => {
        this.store.dispatch(data ? setUser(data) : logout());
      });
    });
  }
}
