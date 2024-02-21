import { Injectable } from "@angular/core";
import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { User as UserModel } from "../models/users.model";
import { Router } from "@angular/router";
import {
  Firestore,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@angular/fire/firestore";
import { Auth } from "@angular/fire/auth";
import { Timestamp } from "@firebase/firestore";
import { Observable, lastValueFrom, take } from "rxjs";
import { Store, select } from "@ngrx/store";
import { logout } from "../store/authentication/authentication.actions";
import { userSelector } from "../store/authentication/authentication.selector";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router,
    private store: Store,
  ) {}

  async login() {
    // Initialize the Google authentication provider
    const provider = new GoogleAuthProvider();

    try {
      // Sign in via popup
      const result = await signInWithPopup(this.auth, provider);
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

    // Get the user document from the database
    const userDoc = doc(this.firestore, "users", user.uid);
    const userDocSnap = await getDoc(userDoc);
    let userData = userDocSnap.data() as UserModel;

    if (!userDocSnap.exists()) {
      userData = this.initUser(
        userDocSnap.data() || {
          id: user.uid,
          email: user.email,
          username: user.displayName,
          picture: user.photoURL,
        },
      );

      // Save the user document to the database
      await setDoc(userDoc, userData, { merge: true });
    }

    // Return the user data
    return userData;
  }

  async getUser(id: string): Promise<UserModel | null> {
    const userDoc = doc(this.firestore, "users", id);
    const userDocSnap = await getDoc(userDoc);

    return (userDocSnap.data() as UserModel) || null;
  }

  getUser$(id: string): Observable<UserModel | null> {
    return new Observable((observer) => {
      const userDoc = doc(this.firestore, "users", id);
      const unsubscribe = onSnapshot(userDoc, (userDocSnap) => {
        observer.next((userDocSnap.data() as UserModel) || null);
      });

      return () => unsubscribe();
    });
  }

  async getCurrentUser(): Promise<UserModel | null> {
    const user$ = this.store.pipe(select(userSelector), take(1));
    const user = await lastValueFrom(user$);

    return user;
  }

  initUser(user: Partial<UserModel>) {
    return {
      id: user.id || "",
      username: user.username || "Unknown",
      picture: user.picture || "assets/user.png",
      email: user.email || "",
      score: user.score || 0,
      scoreUpdatedAt: user.scoreUpdatedAt || Timestamp.fromDate(new Date()),
      stats: user.stats || {
        translations: 0,
        validatedTranslations: 0,
        recordings: 0,
        validatedRecordings: 0,
      },
      createdAt: user.createdAt || Timestamp.fromDate(new Date()),
      lastLoginAt: user.lastLoginAt || Timestamp.fromDate(new Date()),
    };
  }
}
