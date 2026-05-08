import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  updateIntegrations, 
  getIntegrations, 
  testIntegration,
  initiateGoogleAuth,
  googleCallback 
} from "../controllers/integration.controller.js";

const router = express.Router();

router.get("/", protect, getIntegrations);
router.put("/", protect, updateIntegrations);
router.post("/test", protect, testIntegration);

router.get("/google/auth", protect, initiateGoogleAuth);
router.get("/google/callback", protect, googleCallback);

export default router;
