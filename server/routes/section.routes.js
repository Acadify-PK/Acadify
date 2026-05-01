import express from "express";
import {
    createSection,
    getSectionsByCourse,
} from "../controllers/section.controller.js";

const router = express.Router();

router.post("/", createSection);
router.get("/:courseId", getSectionsByCourse);

export default router;