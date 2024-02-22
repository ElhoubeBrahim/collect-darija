import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";

import { provideToastr } from "ngx-toastr";

import { routes } from "./app.routes";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from "@angular/fire/firestore";
import { connectAuthEmulator, getAuth, provideAuth } from "@angular/fire/auth";
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from "@angular/fire/analytics";
import { environment } from "../environments/environment.development";
import { provideState, provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { authenticationReducer } from "./store/authentication/authentication.reducer";
import { leaderboardReducer } from "./store/leaderboard/leaderboard.reducer";
import { provideEcharts } from "ngx-echarts";
import { weeklyContributionsReducer } from "./store/weekly-contributions/weekly-contributions.reducer";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();

        if (environment.useEmulators) {
          connectAuthEmulator(auth, "http://localhost:9099");
        }

        return auth;
      }),
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();

        if (environment.useEmulators) {
          connectFirestoreEmulator(firestore, "localhost", 8080);
        }

        return firestore;
      }),
    ),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
    UserTrackingService,
    provideAnimations(),
    provideToastr(),
    provideStore(),
    provideState({
      name: "authentication",
      reducer: authenticationReducer,
    }),
    provideState({
      name: "leaderboard",
      reducer: leaderboardReducer,
    }),
    provideState({
      name: "weekly-contributions",
      reducer: weeklyContributionsReducer,
    }),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEcharts(),
    provideAnimationsAsync("noop"),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        (req, next) => {
          // Get the access token from local storage
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            req = req.clone({
              headers: req.headers.set(
                "Authorization",
                `Bearer ${accessToken}`,
              ),
            });
          }

          // Add the API base URL to the request
          req = req.clone({
            url: `${environment.apiURL}${req.url}`,
          });
          return next(req);
        },
      ]),
    ),
  ],
};
