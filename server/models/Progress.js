import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
    },

    completed: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Progress", progressSchema);