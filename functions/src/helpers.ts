import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";

export const authorizeRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Check if the request has an Authorization header
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    res.status(403).send("Unauthorized");
    return;
  }

  // Get the ID token from the Authorization header
  let idToken = req.headers.authorization.split("Bearer ")[1];

  // Extract user data from the ID token
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedIdToken.uid;

    // Get the user data from the Firestore database
    const user = await admin.firestore().collection("users").doc(userId).get();
    if (!user.exists) {
      res.status(403).send("Unauthorized");
      return;
    }

    // @ts-ignore
    req.user = user.data();
    next();
    return;
  } catch (error) {
    res.status(403).send("Unauthorized");
    return;
  }
};

export const getTopUsers = async (n: number) => {
  const usersQuery = await admin
    .firestore()
    .collection("users")
    .orderBy("score", "desc")
    .orderBy("scoreUpdatedAt", "asc")
    .limit(n)
    .where("score", ">", 0)
    .get();

  return usersQuery.docs.map((doc) => doc.data());
};

export const getUserRanking = async (userId: string) => {
  // Get the user data from the Firestore database
  const user = await admin.firestore().collection("users").doc(userId).get();
  if (!user || !user.exists) return null;

  // Get all users with a score greater than or equal to the current user's score
  const usersQuery = await admin
    .firestore()
    .collection("users")
    .orderBy("score", "desc")
    .orderBy("scoreUpdatedAt", "asc")
    .where("score", ">=", user.data()?.score)
    .limit(1000)
    .get();

  // Return the user's ranking
  return usersQuery.docs.findIndex((u) => u.id === userId) + 1;
};
