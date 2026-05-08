import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        default: "student",
    },
  isShadowBanned: {
    type: Boolean,
    default: false,
  },
  isFlagged: {
    type: Boolean,
    default: false,
  },
  moderationNotes: {
    type: String,
    default: "",
  },
}, { timestamps: true });

// 🔐 hash before save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 compare password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
