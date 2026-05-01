import express from 'express';
import { createCourse, getAllCourses, getCourseById, getFullCourse } from '../controllers/course.controller';

const router = express.Router();

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/full/:id", getFullCourse);

export default router;