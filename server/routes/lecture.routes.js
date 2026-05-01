import express from "express";
import {
    createLecture,
    getLecturesBySection,
} from "../controllers/lecture.controller.js";

const router = express.Router();

router.post("/", createLecture);
router.get("/:sectionId", getLecturesBySection);

export default router;