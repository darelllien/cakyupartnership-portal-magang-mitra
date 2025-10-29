import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRequest } from "../middleware/authMiddleware"; // pastikan path-nya benar

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

/**
 * 🔐 Login user (Admin / Mahasiswa)
 */
export const loginUser = (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Dummy data user — nanti bisa diganti dari database
  const users = [
    { id: 1, username: "admin@portaljob.com", password: "123", role: "admin" },
    { id: 2, username: "linn@gmail.com", password: "123", role: "user" },
  ];

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // ✅ generate JWT token
  const token = jwt.sign(
    { sub: String(user.id), username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // kirim token + role ke frontend
  res.json({ token, role: user.role });
};

/**
 * 👤 Mendapatkan user yang sedang login (untuk /api/auth/me)
 */
export const getCurrentUser = (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.json({
    id: req.user.sub,
    username: req.user.username,
    role: req.user.role,
  });
};
