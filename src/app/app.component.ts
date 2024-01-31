import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { RouterOutlet } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { Store } from "@ngrx/store";
import { login, logout } from "./store/authentication/authentication.actions";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  title = "collect-darija";

  constructor(
    private auth: AngularFireAuth,
    private authentication: AuthenticationService,
    private store: Store,
  ) {
    // Get the current user
    this.auth.authState.subscribe(async (user) => {
      // If the user is logged in, store the user data in the store
      if (user) {
        const userData = await this.authentication.getUser(user.uid);
        this.store.dispatch(userData ? login(userData) : logout());
      }
    });
  }
}
