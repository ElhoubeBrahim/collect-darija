import { createAction } from "@ngrx/store";
import { User } from "../../models/users.model";

export const AUTH_LOGIN = "[Authentication] Login";
export const AUTH_LOGOUT = "[Authentication] Logout";

export const login = createAction(AUTH_LOGIN, (data: User) => ({ data }));
export const logout = createAction(AUTH_LOGOUT);
