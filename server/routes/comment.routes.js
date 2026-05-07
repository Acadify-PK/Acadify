import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { addComment, getComments, deleteComment, moderateComment } from '../controllers/comment.controller.js';

const router = express.Router();

// Public: get comments for a course
router.get('/:courseId', getComments);

// Protected: add comment
router.post('/', protect, addComment);

// Protected: delete comment (owner, course instructor, or admin)
router.delete('/:id', protect, deleteComment);

// Protected: moderate (hide/unhide) comment (course instructor or admin)
router.patch('/:id/moderate', protect, moderateComment);

export default router;
