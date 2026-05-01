import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    title: String,
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    },
    videoUrl: String,
    order: Number,
})

export default mongoose.model('Lecture', lectureSchema);