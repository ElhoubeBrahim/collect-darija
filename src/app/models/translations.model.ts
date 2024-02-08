import { Timestamp } from "@firebase/firestore";

export interface Translation {
  id: string;
  userId: string;
  sentenceId: string;
  translation: string;
  translatedAt: Timestamp;
}
