import express from "express";
import {
    createLecture,
    getLecturesBySection,
} from "../controllers/lecture.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isInstructor } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, isInstructor, createLecture);
router.get("/:sectionId", getLecturesBySection);

export default router;
