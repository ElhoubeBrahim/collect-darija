import { Timestamp } from "firebase/firestore";
import { Sentence } from "./sentences.model";
import { Translation } from "./translations.model";

export interface Review {
  id: string;
  userId: string;
  sentence: { id: string; content: string };
  translation: { id: string; userId: string; content: string };
  rating: number;
  comment: string;
  reviewedAt: Timestamp;
}
