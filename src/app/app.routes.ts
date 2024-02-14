import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { LeaderboardComponent } from "./pages/leaderboard/leaderboard.component";
import { HistoryComponent } from "./pages/history/history.component";
import {
  AngularFireAuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from "@angular/fire/compat/auth-guard";
import { MainComponent } from "./components/main/main.component";
import { TranslateComponent } from "./pages/translate/translate.component";

export const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectUnauthorizedTo(["login"]) },
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "home",
      },
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
        path: "history",
        component: HistoryComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo([""]) },
  },
];
