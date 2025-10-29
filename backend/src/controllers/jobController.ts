import { Request, Response } from "express";
import { readJobs, writeJobs, validateUrl } from "../utils/fileUtils";
import { Job } from "../models/jobModel";

// GET semua job
export const getAllJobs = (_req: Request, res: Response) => {
  res.json(readJobs());
};

// POST tambah job
export const createJob = (req: Request, res: Response) => {
  const jobs = readJobs();
  const { title, company, location, description, link, contact } = req.body;

  if (!title || !company || !location) {
    return res.status(400).json({
      message: "Field title, company, dan location wajib diisi.",
    });
  }

  const newJob: Job = {
    id: Date.now(),
    title,
    company,
    location,
    description: description ?? "",
    link: validateUrl(link),
    contact: typeof contact === "string" ? contact : null,
    createdAt: new Date().toISOString(),
  };

  jobs.push(newJob);
  writeJobs(jobs);
  res.status(201).json(newJob);
};

// PUT update job
// PUT /api/jobs/:id
export const updateJob = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const jobs = readJobs();
  const index = jobs.findIndex((j) => j.id === id);

  // Cek kalau job tidak ditemukan
  if (index === -1) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  const old = jobs[index]!; // ✅ tanda seru (!) artinya "pasti tidak undefined"

  const { title, company, location, description, link, contact } = req.body;

  const updatedJob: Job = {
    ...old, // tetap bawa id & createdAt
    title: title ?? old.title,
    company: company ?? old.company,
    location: location ?? old.location,
    description: description ?? old.description,
    link: typeof link === "string" ? validateUrl(link) : old.link ?? null,
    contact: typeof contact === "string" ? contact : old.contact ?? null,
    updatedAt: new Date().toISOString(),
  };

  jobs[index] = updatedJob;
  writeJobs(jobs);
  res.json(updatedJob);
};

// DELETE job
export const deleteJob = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const jobs = readJobs();
  const filtered = jobs.filter((j) => j.id !== id);

  if (filtered.length === jobs.length) {
    return res.status(404).json({ message: "Job not found" });
  }

  writeJobs(filtered);
  res.json({ message: "Job deleted successfully" });
};
