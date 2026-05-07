import mongoose from 'mongoose';

const moderationLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ['hide', 'unhide', 'delete'],
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moderatorRole: {
      type: String,
    },
    reason: String,
    previousState: Object,
    newState: Object,
  },
  { timestamps: true },
);

// Indexes to improve query performance for common filters/sorts
moderationLogSchema.index({ course: 1 });
moderationLogSchema.index({ action: 1 });
moderationLogSchema.index({ createdAt: -1 });

export default mongoose.model('ModerationLog', moderationLogSchema);
