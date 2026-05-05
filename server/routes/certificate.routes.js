import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { generateCertificate } from "../controllers/certificate.controller.js";

const router = express.Router();

router.get("/:courseId", protect, generateCertificate);

export default router;
