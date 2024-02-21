import { Request, Response } from "express";
import { onRequest } from "firebase-functions/v2/https";

import * as express from "express";
import * as admin from "firebase-admin";
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

// Create PayPal order route
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

export const api = onRequest(app);
