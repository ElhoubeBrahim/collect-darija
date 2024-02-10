import { Timestamp } from "@firebase/firestore";

export interface User {
  id: string;
  username: string;
  picture: string;
  email: string;
  score: number;
  scoreUpdatedAt: Timestamp;
  stats: {
    translations: number;
    validatedTranslations: number;
    recordings: number;
    validatedRecordings: number;
  };
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface UserWithRanking extends User {
  ranking: number;
}
