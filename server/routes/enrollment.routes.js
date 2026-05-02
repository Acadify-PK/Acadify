import express from "express";
import {
    enrollCourse,
    checkEnrollment,
    getMyCourses,
} from "../controllers/enrollment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", protect, getMyCourses);
router.post("/", protect, enrollCourse);
router.get("/check", protect, checkEnrollment);

export default router;