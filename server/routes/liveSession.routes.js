import express from "express";
import { startLiveSession, endLiveSession, getLiveSession } from "../controllers/liveSession.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/start", protect, startLiveSession);
router.put("/end/:sessionId", protect, endLiveSession);
router.get("/course/:courseId", getLiveSession);

export default router;
