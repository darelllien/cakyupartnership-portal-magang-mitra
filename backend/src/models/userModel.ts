export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: "admin" | "user";
  createdAt: string;
}
