import { Timestamp } from "firebase/firestore";
import { Sentence } from "./sentences.model";
import { Translation } from "./translations.model";

export interface Review {
  id: string;
  userId: string;
  sentence: Sentence;
  translation: Translation;
  rating: number;
  comment: string;
  reviewedAt: Timestamp;
}
