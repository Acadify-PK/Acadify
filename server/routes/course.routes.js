import express from 'express';
import { createCourse, getAllCourses, getCourseById, getFullCourse, publishCourse } from '../controllers/course.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { isInstructor } from '../middleware/role.middleware.js';

const router = express.Router();

router.post("/", protect, isInstructor, createCourse);
router.patch("/:id/publish", protect, isInstructor, publishCourse);
router.get("/", getAllCourses);
router.get("/full/:id", getFullCourse);
router.get("/:id", getCourseById);

export default router;
