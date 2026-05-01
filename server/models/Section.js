import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
    title: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    order: Number,
})

export default mongoose.model('Section', sectionSchema);