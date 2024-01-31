import { Injectable } from "@angular/core";
import {
  signInWithPopup,
  getAuth,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { User as UserModel } from "../models/users.model";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { lastValueFrom, take } from "rxjs";
import { Store } from "@ngrx/store";
import { login, logout } from "../store/authentication/authentication.actions";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private store: Store,
  ) {}

  async login() {
    // Initialize the Google authentication provider
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      // Sign in via popup
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);

      // If the login was successful, return the user and the access token
      if (credential) {
        const token = credential.accessToken;
        const user = result.user;
        return {
          success: true,
          data: { user, token },
        };
      }
    } catch (error: any) {
      // If the login was not successful, display an error message
      console.error(error);
      return {
        success: false,
        error: "Authentication failed! Please try again.",
      };
    }

    return {
      success: false,
      error: "Something went wrong",
    };
  }

  async logout() {
    // Logout from the authentication service
    await this.auth.signOut();

    // Clear the user data from the store
    this.store.dispatch(logout());

    // Redirect to the login page
    this.router.navigate(["/login"]);
  }

  async saveUser(user: User): Promise<UserModel | null> {
    if (!user.email) return null;

    // Get user data from the database
    let userData = await this.getUser(user.uid);

    // If the user document does not exist, create a new user, otherwise update the existing user
    userData = {
      id: user.uid,
      username: user.displayName || "Unknown",
      picture: user.photoURL || "assets/user.png",
      email: user.email,
      score: userData?.score || 0,
      translationsCount: userData?.translationsCount || 0,
      createdAt: userData?.createdAt || new Date(),
      lastLoginAt: new Date(),
    };

    // Save the user document to the database
    await this.firestore
      .collection("users")
      .doc(user.uid)
      .set(userData, { merge: true });

    // Return the user data
    return userData;
  }

  async getUser(id: string): Promise<UserModel | null> {
    // Get user document from the database
    const userDoc$ = this.firestore
      .collection("users")
      .doc(id)
      .get()
      .pipe(take(1));
    const userDoc = await lastValueFrom(userDoc$);

    // If the user document does not exist, return null
    if (!userDoc.exists) return null;

    // Otherwise, return the user data
    return userDoc.data() as UserModel;
  }
}
