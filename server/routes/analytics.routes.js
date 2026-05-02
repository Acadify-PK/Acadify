import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getInstructorAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protect, getInstructorAnalytics);

export default router;
