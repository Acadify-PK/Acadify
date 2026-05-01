import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: String,
    description: String,

    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    price: {
        type: Number,
        default: 0,
    },

    thumbnail: String,

    category: String,

    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
    },

    published: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);