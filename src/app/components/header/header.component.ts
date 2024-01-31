import { Component } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { userSelector } from "../../store/authentication/authentication.selector";
import { AsyncPipe, JsonPipe } from "@angular/common";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [AsyncPipe, JsonPipe],
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  user$ = this.store.pipe(select(userSelector));

  constructor(private store: Store) {}
}
