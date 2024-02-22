import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";

import * as express from "express";
import * as admin from "firebase-admin";
import * as uuid from "uuid";
import { Timestamp } from "firebase-admin/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { authorizeRequest, getTopUsers, getUserRanking } from "./helpers";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  projectId: process.env.PROJECT_ID,
  credential: admin.credential.applicationDefault(),
});

// Create an Express app
const app = express();
app.use(express.json());
app.use(authorizeRequest);

app.get("/leaderboard", async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;
  const users = await getTopUsers(10);

  // Construct the leaderboard
  const leaderboard = users.map((u, index) => ({
    id: u.id,
    username: u.username,
    picture: u.picture,
    score: u.score,
    stats: u.stats,
    ranking: index + 1,
  }));

  // Check if the current user is in the leaderboard
  if (user.score > 0 && !leaderboard.find((u) => u.id === user.id)) {
    // Get the current user's ranking
    const ranking = await getUserRanking(user.id);

    // Add the current user to the leaderboard
    if (ranking != null && ranking > 10) {
      leaderboard.push({
        id: user.id,
        username: user.username,
        picture: user.picture,
        score: user.score,
        stats: user.stats,
        ranking,
      });
    }
  }

  res.json({
    leaderboard,
  });
});

app.get("/weekly-contributions", async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;

  // Get the current date
  const now = new Date();
  const range = [
    new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
  ];

  // Get the translations
  const translationsQuery = await admin
    .firestore()
    .collection("translations")
    .where("userId", "==", user.id)
    .where("translatedAt", ">=", range[0])
    .where(
      "translatedAt",
      "<=",
      new Date(range[1].getTime() + 24 * 60 * 60 * 1000),
    )
    .get();
  const translations = translationsQuery.docs.map((doc) => doc.data());

  // Count contributions
  const contributions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    contributions.push({
      day: date,
      value: translations.filter(
        (translation) =>
          translation.translatedAt.toDate().toDateString() ===
          date.toDateString(),
      ).length,
    });
  }

  res.json(contributions.reverse());
});

app.get("/sentence", async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;

  // Get a random sentence
  const key = uuid.v4();
  let sentencesQuery = await admin
    .firestore()
    .collection("sentences")
    .where("id", ">=", key)
    .limit(1)
    .get();
  if (sentencesQuery.empty) {
    // If no sentence found, get the first one in the other direction
    sentencesQuery = await admin
      .firestore()
      .collection("sentences")
      .where("id", "<", key)
      .limit(1)
      .get();
  }

  // Return the sentence
  const sentence = sentencesQuery.docs.map((doc) => doc.data())[0];
  res.json({ sentence });
});

app.get("/history", async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;

  // Get the translations
  const translationsQuery = await admin
    .firestore()
    .collection("translations")
    .where("userId", "==", user.id)
    .orderBy("translatedAt", "desc")
    .limit(10)
    .get();
  const translations = translationsQuery.docs.map((doc) => doc.data());

  res.json(translations);
});

app.post("/translate", async (req: Request, res: Response) => {
  // @ts-ignore
  const user = req.user;
  const data = req.body;

  // Validate the request
  if (
    !data.sentenceId ||
    !data.translation ||
    data.translation.trim().length === 0
  ) {
    res.status(400).json({ message: "Invalid request" });
    return;
  }

  // Get the sentence
  const sentenceDoc = await admin
    .firestore()
    .collection("sentences")
    .doc(data.sentenceId)
    .get();
  const sentence = sentenceDoc.data();
  if (!sentence) {
    res.status(404).json({ message: "Sentence not found" });
    return;
  }

  // This is disabled because the user can translate the same sentence multiple times
  // Check if sentence is already translated by the user
  // const translationQuery = await admin
  //   .firestore()
  //   .collection("translations")
  //   .where("userId", "==", user.id)
  //   .where("sentenceId", "==", sentence.id)
  //   .get();
  // if (!translationQuery.empty) {
  //   res.status(400).json({ message: "Sentence already translated" });
  //   return;
  // }

  // Create a new translation
  const translation = {
    id: admin.firestore().collection("translations").doc().id,
    userId: user.id,
    sentence: {
      id: sentence.id,
      content: sentence.content,
    },
    translation: data.translation.trim(),
    translatedAt: Timestamp.fromDate(new Date()),
  };

  // Start a Firestore transaction
  await admin.firestore().runTransaction(async (transaction) => {
    // Save the translation
    const translationDoc = admin
      .firestore()
      .collection("translations")
      .doc(translation.id);
    transaction.set(translationDoc, translation);

    // Update the sentence translations count
    const sentenceDoc = admin
      .firestore()
      .collection("sentences")
      .doc(sentence.id);
    transaction.update(sentenceDoc, {
      translationsCount: FieldValue.increment(1),
    });

    // Update user translations count & score
    const userDoc = admin.firestore().collection("users").doc(user.id);
    transaction.update(userDoc, {
      "stats.translations": FieldValue.increment(1),
      score: FieldValue.increment(10),
      scoreUpdatedAt: Timestamp.fromDate(new Date()),
    });
  });

  res.json({
    message: "Translation saved",
    translation,
  });
});

export const api = onRequest(app);
