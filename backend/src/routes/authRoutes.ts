import { Router } from "express";
import { loginUser, getCurrentUser } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/login", loginUser);
router.get("/me", authenticate, getCurrentUser);

export default router;
