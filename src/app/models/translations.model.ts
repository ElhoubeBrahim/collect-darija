import { Timestamp } from "@firebase/firestore";

export interface Translation {
  id: string;
  userId: string;
  sentence: {
    id: string;
    content: string;
  };
  translation: string;
  translatedAt: Timestamp;
}
