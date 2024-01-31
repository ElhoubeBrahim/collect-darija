export interface User {
  id: string;
  username: string;
  picture: string;
  email: string;
  score: number;
  translationsCount: number;
  createdAt: Date;
  lastLoginAt: Date;
}
