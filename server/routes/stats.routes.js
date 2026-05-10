import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Lecture from "../models/Lecture.js";

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const [studentsCount, instructorsCount, coursesCount, lecturesCount] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments({ published: true }),
      Lecture.countDocuments()
    ]);

    res.json({
      students: studentsCount,
      instructors: instructorsCount,
      courses: coursesCount,
      lectures: lecturesCount,
      satisfaction: 98 // Static for now as it needs a specific algorithm
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching public stats" });
  }
});

export default router;
