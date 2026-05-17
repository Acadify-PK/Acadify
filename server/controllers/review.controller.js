import Review from "../models/Review.js";

export const addReview = async (req, res) => {
    try {
        const userId = req.user._id;
        const { courseId, rating, comment } = req.body;

        const review = await Review.create({
            user: userId,
            course: courseId,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({
            course: req.params.courseId,
        }).populate('user', 'name');

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}