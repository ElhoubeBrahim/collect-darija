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
import { FIREBASE_OPTIONS } from "@angular/fire/compat";
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from "@angular/fire/compat/firestore";
import { authenticationReducer } from "./store/authentication/authentication.reducer";
import { leaderboardReducer } from "./store/leaderboard/leaderboard.reducer";
import { provideEcharts } from "ngx-echarts";
import { weeklyContributionsReducer } from "./store/weekly-contributions/weekly-contributions.reducer";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators ? ["localhost", 8080] : undefined,
    },
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
  ],
};
