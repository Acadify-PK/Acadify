import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { getModerationLogs } from '../controllers/moderation.controller.js';

const router = express.Router();

// GET /api/moderation?courseId=...  (admin or instructor for their course)
router.get('/', protect, getModerationLogs);

export default router;
