import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthenticationState } from "./authentication.reducer";

export const userSelector = createSelector(
  createFeatureSelector<AuthenticationState>("authentication"),
  (state: AuthenticationState) => state.user,
);
