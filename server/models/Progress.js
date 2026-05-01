import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },

    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
    },

    completed: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
