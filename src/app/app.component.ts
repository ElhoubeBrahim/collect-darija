import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { RouterOutlet } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";
import { Store } from "@ngrx/store";
import {
  login,
  logout,
  setUser,
} from "./store/authentication/authentication.actions";
import { of, switchMap } from "rxjs";

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
    this.auth.authState
      .pipe(
        switchMap((user) =>
          user ? this.authentication.getUser(user.uid) : of(null),
        ),
      )
      .subscribe((data) => {
        this.store.dispatch(data ? setUser(data) : logout());
      });
  }
}
