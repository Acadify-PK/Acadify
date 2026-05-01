import Enrollment from "../models/Enrollment.js";

export const enrollCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        // prevent duplicate enrollment
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
        const { userId, courseId } = req.query;

        const enrollment = await Enrollment.findOne({
            user: userId,
            course: courseId,
        });

        res.json({ enrolled: !!enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};