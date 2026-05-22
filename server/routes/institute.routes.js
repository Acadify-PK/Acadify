import express from "express";
import { 
    registerInstitute, 
    getInstituteDetails, 
    getPendingInstitutes, 
    verifyInstitute,
    resendApprovalEmail,
    getAllInstitutes
} from "../controllers/institute.controller.js";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// Public / Guest
router.post("/register", optionalAuth, registerInstitute);

// Admin Only
router.get("/all", protect, isAdmin, getAllInstitutes);
router.get("/pending", protect, isAdmin, getPendingInstitutes);
router.patch("/verify/:id", protect, isAdmin, verifyInstitute);
router.post("/resend-email/:id", protect, isAdmin, resendApprovalEmail);

// Details
router.get("/:slug", getInstituteDetails);

export default router;

