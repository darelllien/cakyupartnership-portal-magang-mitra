export interface User {
  id: number;
  username: string;
  passwordHash: string; // hashed
  role: "admin" | "user";
  createdAt: string;
}
