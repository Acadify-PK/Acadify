import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getProgress,
    markComplete,
} from "../controllers/progress.controller.js";

const router = express.Router();

router.post("/", protect, markComplete);
router.get("/:courseId", protect, getProgress);

export default router;
