import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // e.g., 'coding-hero'
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional until verified
    ownerEmail: { type: String, required: true }, // Track who requested it
    ownerName: { type: String },
    config: {
        logo: String,
        banner: String,
        primaryColor: { type: String, default: "#06b6d4" }, // Cyan-500
        description: String,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Institute", instituteSchema);
