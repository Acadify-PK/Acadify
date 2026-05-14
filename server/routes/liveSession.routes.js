import express from "express";
import { startLiveSession, endLiveSession, getLiveSession } from "../controllers/liveSession.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isInstructor } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/start", protect, isInstructor, startLiveSession);
router.put("/end/:sessionId", protect, endLiveSession);
router.get("/course/:courseId", protect, getLiveSession);

export default router;
