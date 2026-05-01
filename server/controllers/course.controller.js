import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";
import Course from "../models/Course.js";

export const createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            ...req.body,
            instructor: req.user._id,
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ published: true }).populate("instructor", "name email");
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const publishCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const isOwner = course.instructor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const sections = await Section.find({ course: course._id }).select("_id");

        if (sections.length === 0) {
            return res.status(400).json({
                message: "Add at least one section before publishing",
            });
        }

        const lectureCount = await Lecture.countDocuments({
            section: { $in: sections.map((section) => section._id) },
        });

        if (lectureCount === 0) {
            return res.status(400).json({
                message: "Add at least one lecture before publishing",
            });
        }

        course.published = true;
        await course.save();

        res.json({ message: "Course published", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("instructor", "name");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getFullCourse = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId).select("-__v");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const sections = await Section.find({ course: courseId })
            .select("-__v")
            .sort({ order: 1 });

        const sectionsWithLectures = await Promise.all(
            sections.map(async (section) => {
                const lectures = await Lecture.find({
                    section: section._id,
                })
                    .select("-__v")
                    .sort({ order: 1 });

                return {
                    ...section.toObject(),
                    lectures,
                };
            })
        );

        res.json({
            ...course.toObject(),
            sections: sectionsWithLectures,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
