import { Router } from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import { authenticate, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

// Semua job bisa dilihat publik (kalau mau bisa tambahkan authenticate juga)
router.get("/", authenticate, authorizeRole(["admin", "user"]), getAllJobs);

// Hanya admin bisa menambah, ubah, hapus
router.post("/", authenticate, authorizeRole(["admin"]), createJob);
router.put("/:id", authenticate, authorizeRole(["admin"]), updateJob);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteJob);

export default router;
