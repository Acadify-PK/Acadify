import Progress from "../models/Progress.js";

export const markComplete = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, lectureId } = req.body;

        const progress = await Progress.findOneAndUpdate(
            {
                user: userId,
                lecture: lectureId,
            },
            {
                $setOnInsert: {
                    user: userId,
                    course: courseId,
                    lecture: lectureId,
                    completed: true,
                },
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(201).json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId } = req.params;

        const progress = await Progress.find({
            user: userId,
            course: courseId,
        }).sort({ createdAt: 1 });

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
