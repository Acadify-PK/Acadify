import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // 📚 instructor courses
    const courses = await Course.find({ instructor: instructorId });

    const courseIds = courses.map(c => c._id);

    // 🎓 enrollments
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });

    // 📊 totals
    const totalCourses = courses.length;
    const totalStudents = enrollments.length;

    // 💰 revenue (simple version)
    let totalRevenue = 0;

    for (const enr of enrollments) {
      const course = courses.find(
        c => c._id.toString() === enr.course.toString()
      );
      if (course) totalRevenue += course.price || 0;
    }

    // 📈 per-course stats
    const courseStats = courses.map(course => {
      const students = enrollments.filter(
        e => e.course.toString() === course._id.toString()
      );

      return {
        _id: course._id,
        title: course.title,
        price: course.price,
        students: students.length,
        revenue: students.length * (course.price || 0),
      };
    });

    res.json({
      totalCourses,
      totalStudents,
      totalRevenue,
      courseStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
