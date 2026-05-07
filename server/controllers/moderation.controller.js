import mongoose from 'mongoose';
import ModerationLog from "../models/ModerationLog.js";
import Course from "../models/Course.js";

export const getModerationLogs = async (req, res) => {
  try {
    const { courseId, page: pageQ, limit: limitQ, q, action, sort } = req.query;

    const page = Math.max(1, parseInt(pageQ, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitQ, 10) || 20));
    const skip = (page - 1) * limit;

    const match = {};
    if (courseId) {
      // ensure valid ObjectId
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        match.course = mongoose.Types.ObjectId(courseId);
      } else {
        return res.status(400).json({ message: 'Invalid courseId' });
      }
    }
    if (action) match.action = action;

    // Build aggregation pipeline to join moderator and comment and support searching
    const pipeline = [
      { $match: match },
      { $lookup: { from: 'comments', localField: 'comment', foreignField: '_id', as: 'comment' } },
      { $unwind: { path: '$comment', preserveNullAndEmptyArrays: true } },
      { $lookup: { from: 'users', localField: 'moderator', foreignField: '_id', as: 'moderator' } },
      { $unwind: { path: '$moderator', preserveNullAndEmptyArrays: true } },
    ];

    if (q && q.trim()) {
      const regex = new RegExp(q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      pipeline.push({
        $match: {
          $or: [
            { 'moderator.name': { $regex: regex } },
            { 'comment.content': { $regex: regex } },
            { reason: { $regex: regex } },
          ],
        },
      });
    }

    // only admins can fetch across courses; instructors must specify their course and be owner
    if (req.user.role === 'admin') {
      // allowed
    } else if (req.user.role === 'instructor') {
      if (!courseId) return res.status(400).json({ message: 'courseId query parameter required for instructors' });
      const course = await Course.findById(courseId).select('instructor');
      if (!course) return res.status(404).json({ message: 'Course not found' });
      if (String(course.instructor) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized to view logs for this course' });
    } else {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort) {
      const key = sort.startsWith('-') ? sort.slice(1) : sort;
      const dir = sort.startsWith('-') ? -1 : 1;
      sortObj = { [key]: dir };
    }

    pipeline.push({ $sort: sortObj });

    // Facet for pagination and total count
    pipeline.push({
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: skip }, { $limit: limit }],
      },
    });

    const result = await ModerationLog.aggregate(pipeline);
    const metadata = (result[0]?.metadata && result[0].metadata[0]) ? result[0].metadata[0].total : 0;
    const data = result[0]?.data || [];

    // data already contains joined moderator and comment objects
    return res.json({ total: metadata, page, limit, pages: Math.ceil(metadata / limit), data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
