import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AuthenticationService } from "../../services/authentication.service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  user$ = this.store.pipe(select(userSelector));

  constructor(
    private store: Store,
    private authentication: AuthenticationService,
  ) {}

  async logout() {
    await this.authentication.logout();
  }
}
