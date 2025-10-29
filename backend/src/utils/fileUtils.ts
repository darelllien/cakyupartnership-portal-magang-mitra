import fs from "fs";
import path from "path";
import { Job } from "../models/jobModel";
import { User } from "../models/userModel";

// ===========================
// 📁 Direktori & Path Data
// ===========================
const dataDir = path.join(__dirname, "../data");
const jobsPath = path.join(dataDir, "jobs.json");
const usersPath = path.join(dataDir, "users.json");

// Pastikan folder & file dasar ada
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(jobsPath)) fs.writeFileSync(jobsPath, "[]", "utf8");
if (!fs.existsSync(usersPath)) fs.writeFileSync(usersPath, "[]", "utf8");

// ===========================
// 🧩 JOBS Helper
// ===========================
export function readJobs(): Job[] {
  try {
    const data = fs.readFileSync(jobsPath, "utf8");
    return JSON.parse(data || "[]") as Job[];
  } catch {
    return [];
  }
}

export function writeJobs(jobs: Job[]): void {
  fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2), "utf8");
}

// ===========================
// 👤 USERS Helper
// ===========================
export function readUsers(): User[] {
  try {
    const data = fs.readFileSync(usersPath, "utf8");
    return JSON.parse(data || "[]") as User[];
  } catch {
    return [];
  }
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf8");
}

// ===========================
// 🌐 URL Validator
// ===========================
export function validateUrl(u: unknown): string | null {
  if (typeof u !== "string" || !u.trim()) return null;
  try {
    const parsed = new URL(u);
    return ["http:", "https:"].includes(parsed.protocol) ? u : null;
  } catch {
    return null;
  }
}
