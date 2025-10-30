import { Request, Response } from "express";
import { readJobs, writeJobs, validateUrl } from "../utils/fileUtils";
import { Job } from "../models/jobModel";

export const getAllJobs = (_req: Request, res: Response) => {
  res.json(readJobs());
};

export const getJobsWithPagination = (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const jobs = readJobs();

  const totalJobs = jobs.length;
  const totalPages = Math.ceil(totalJobs / limit);

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedJobs = jobs.slice(startIndex, endIndex);

  res.json({
    jobs: paginatedJobs,
    currentPage: page,
    totalPages,
    totalJobs,
  });
};

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

export const updateJob = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  const jobs = readJobs();
  const index = jobs.findIndex((j) => j.id === id);

  if (index === -1) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  const old = jobs[index]!;

  const { title, company, location, description, link, contact } = req.body;

  const updatedJob: Job = {
    ...old,
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
