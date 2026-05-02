import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";

export const getMyCourses = async (req, res) => {
    try {
        const userId = req.user._id;

        const enrollments = await Enrollment.find({ user: userId }).populate(
            "course"
        );

        const result = [];

        for (const enr of enrollments) {
            const course = enr.course;
            if (!course) continue;

            // total lectures
            const sections = await Section.find({ course: course._id });
            const sectionIds = sections.map((s) => s._id);
            const totalLectures = await Lecture.countDocuments({
                section: { $in: sectionIds },
            });

            // completed lectures
            const completed = await Progress.countDocuments({
                user: userId,
                course: course._id,
            });

            const progressPercent = totalLectures
                ? Math.round((completed / totalLectures) * 100)
                : 0;

            result.push({
                ...course.toObject(),
                progressPercent,
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const enrollCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (course.instructor?.toString() === userId.toString()) {
            return res.status(403).json({
                message: "Instructors cannot enroll in their own courses",
            });
        }

        const existing = await Enrollment.findOne({
            user: userId,
            course: courseId,
        });

        if (existing) {
            return res.status(400).json({ message: "Already enrolled" });
        }

        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const checkEnrollment = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.query;

        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
        });

        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
