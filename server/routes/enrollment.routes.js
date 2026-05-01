import express from "express";
import {
    enrollCourse,
    checkEnrollment,
} from "../controllers/enrollment.controller.js";

const router = express.Router();

router.post("/", enrollCourse);
router.get("/check", checkEnrollment);

export default router;