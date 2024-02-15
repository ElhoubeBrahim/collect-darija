import { createAction } from "@ngrx/store";
import { User } from "../../models/users.model";

export const AUTH_SET_USER = "[Authentication] Set User";
export const AUTH_LOGIN = "[Authentication] Login";
export const AUTH_LOGOUT = "[Authentication] Logout";

export const setUser = createAction(AUTH_SET_USER, (data: User) => ({ data }));
export const login = createAction(AUTH_LOGIN);
export const logout = createAction(AUTH_LOGOUT);
