import Section from "../models/Section";

export const createSection = async (req, res) => {
    try {
        const { title, courseId } = req.body;

        const section = await Section.create({
            title,
            course: courseId,
            order: 0, // temporary, will be updated later
        })

        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSectionsByCourse = async (req, res) => {
    try {
        const sections = await Section.find({
            course: req.params.courseId,
        }).sort({ order: 1 });

        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}