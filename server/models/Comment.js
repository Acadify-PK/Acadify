import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // moderation fields
    hidden: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderationReason: String,
    moderatedAt: Date,
  },
  { timestamps: true },
);

commentSchema.index({ course: 1, createdAt: -1 });
commentSchema.index({ course: 1, hidden: 1, createdAt: -1 });

export default mongoose.model('Comment', commentSchema);
