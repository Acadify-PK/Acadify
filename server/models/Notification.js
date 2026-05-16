import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: {
    type: String,
    enum: [
      "new_comment", 
      "comment_moderated", 
      "user_status_update", 
      "course_published",
      "enrollment_success",
      "new_lecture",
      "live_session_started",
      "achievement_unlocked",
      "system_alert"
    ],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // For storing extra IDs like courseId, achievementId etc.
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // e.g. /course/123#comment-456
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
}, { timestamps: true });

// Index for fetching unread counts quickly
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
