import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getModerationLogs, updateUserStatus } from '../controllers/moderation.controller.js';

const router = express.Router();

// GET /api/moderation?courseId=...  (admin or instructor for their course)
router.get('/', protect, getModerationLogs);

// PATCH /api/moderation/user/:userId - Update user status (shadow ban, flag)
router.patch('/user/:userId', protect, updateUserStatus);

export default router;
