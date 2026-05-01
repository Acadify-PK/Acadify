import express from "express";
import {
    enrollCourse,
    checkEnrollment,
} from "../controllers/enrollment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, enrollCourse);
router.get("/check", protect, checkEnrollment);

export default router;