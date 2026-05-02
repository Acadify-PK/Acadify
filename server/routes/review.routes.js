import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    addReview,
    getReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", protect, addReview);
router.get("/:courseId", getReviews);

export default router;