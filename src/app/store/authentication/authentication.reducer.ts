import { createReducer, on } from "@ngrx/store";
import { User } from "../../models/users.model";
import { login, logout, setUser } from "./authentication.actions";

export interface AuthenticationState {
  isAuthenticated: boolean;
  user: User | null;
}

const initalState: AuthenticationState = {
  isAuthenticated: false,
  user: null,
};

export const authenticationReducer = createReducer(
  initalState,
  on(setUser, (state, { data }) => ({ user: data, isAuthenticated: true })),
  on(logout, () => ({ user: null, isAuthenticated: false })),
);
