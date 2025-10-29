import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Job Portal API!");
});

const dataDir = path.join(__dirname, "data");
const dataPath = path.join(dataDir, "jobs.json");

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "[]", "utf8");

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

function readJobs(): Job[] {
  try {
    const data = fs.readFileSync(dataPath!, "utf8");
    return JSON.parse(data || "[]") as Job[];
  } catch {
    return [];
  }
}

function writeJobs(jobs: Job[]): void {
  fs.writeFileSync(dataPath!, JSON.stringify(jobs, null, 2), "utf8");
}

app.get("/api/jobs", (req: Request, res: Response) => {
  const jobs = readJobs();
  res.json(jobs);
});

app.post("/api/jobs", (req: Request, res: Response) => {
  const jobs = readJobs();

  const newJob: Job = {
    id: Date.now(),
    title: req.body.title ?? "Untitled Job",
    company: req.body.company ?? "Unknown Company",
    location: req.body.location ?? "N/A",
    description: req.body.description ?? "",
    createdAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  writeJobs(jobs);
  res.status(201).json(newJob);
});

app.put("/api/jobs/:id", (req: Request, res: Response) => {
  const idStr = req.params.id;
  if (!idStr) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const id = parseInt(idStr);
  const jobs = readJobs();
  const index = jobs.findIndex((j: Job) => j.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Job not found" });
  }

  jobs[index] = {
    ...jobs[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  writeJobs(jobs);
  res.json(jobs[index]);
});

app.delete("/api/jobs/:id", (req: Request, res: Response) => {
  const idStr = req.params.id;
  if (!idStr) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const id = parseInt(idStr);
  const jobs = readJobs();
  const filtered = jobs.filter((j: Job) => j.id !== id);

  if (filtered.length === jobs.length) {
    return res.status(404).json({ message: "Job not found" });
  }

  writeJobs(filtered);
  res.json({ message: "Job deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
