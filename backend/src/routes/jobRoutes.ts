import { Router } from "express";
import {
  getAllJobs,
  getJobsWithPagination,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import { authenticate, authorizeRole } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/",
  authenticate,
  authorizeRole(["admin", "user"]),
  getJobsWithPagination
);

router.post("/", authenticate, authorizeRole(["admin"]), createJob);
router.put("/:id", authenticate, authorizeRole(["admin"]), updateJob);
router.delete("/:id", authenticate, authorizeRole(["admin"]), deleteJob);

export default router;
