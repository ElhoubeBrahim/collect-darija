import { Component } from "@angular/core";
import { AuthenticationService } from "../../services/authentication.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  async login() {
    // Login via the authentication service
    const result = await this.authenticationService.login();

    // If the login was not successful, display an error message
    if (!result.success || !result.data || !result.data.token) {
      this.toastr.error(
        result.error || "Authentication failed! Please try again.",
      );
      return;
    }

    // Otherwise
    // Save the user to the database
    const user = await this.authenticationService.saveUser(result.data.user);
    if (!user) {
      this.toastr.error("Authentication failed! Please try again.");
      return;
    }

    // Redirect to the home page
    this.router.navigate(["/"]);
  }
}
