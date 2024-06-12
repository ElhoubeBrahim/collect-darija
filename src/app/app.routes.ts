import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { LeaderboardComponent } from "./pages/leaderboard/leaderboard.component";
import { HistoryComponent } from "./pages/history/history.component";
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from "@angular/fire/auth-guard";
import { MainComponent } from "./components/main/main.component";
import { TranslateComponent } from "./pages/translate/translate.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { ValidateComponent } from "./pages/validate/validate.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/home",
  },
  {
    path: "",
    component: MainComponent,
    ...canActivate(() => redirectUnauthorizedTo(["login"])),
    children: [
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "leaderboard",
        component: LeaderboardComponent,
      },
      {
        path: "translate",
        component: TranslateComponent,
      },
      {
        path: "validate",
        component: ValidateComponent,
      },
      {
        path: "history",
        component: HistoryComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    ...canActivate(() => redirectLoggedInTo(["home"])),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
