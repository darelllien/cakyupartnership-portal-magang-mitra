import express, { Request, Response } from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Job Portal API!");
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
