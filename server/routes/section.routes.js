import express from "express";
import {
    createSection,
    getSectionsByCourse,
} from "../controllers/section.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isInstructor } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, isInstructor, createSection);
router.get("/:courseId", getSectionsByCourse);

export default router;
