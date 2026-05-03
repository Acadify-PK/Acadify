import PDFDocument from "pdfkit";
import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Section from "../models/Section.js";
import Lecture from "../models/Lecture.js";

export const generateCertificate = async (req, res) => {
    try {
        const user = req.user;
        const { courseId } = req.params;

        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const course = await Course.findById(courseId).select("title");

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const sections = await Section.find({ course: courseId }).select("_id");
        const sectionIds = sections.map((section) => section._id);

        const totalLectures = await Lecture.countDocuments({
            section: { $in: sectionIds },
        });

        const completedLectureIds = await Progress.distinct("lecture", {
            user: user._id,
            course: courseId,
            completed: true,
        });

        if (completedLectureIds.length < totalLectures || totalLectures === 0) {
            return res.status(403).json({
                message: "Complete the course to get certificate",
            });
        }

        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margin: 48,
        });

        const safeTitle = course.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || "certificate";

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${safeTitle}-certificate.pdf`
        );
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);

        const width = doc.page.width;
        const height = doc.page.height;
        const pad = 36;

        doc.roundedRect(pad, pad, width - pad * 2, height - pad * 2, 20)
            .lineWidth(4)
            .strokeColor("#0f172a")
            .stroke();

        doc.roundedRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2, 16)
            .lineWidth(1)
            .strokeColor("#38bdf8")
            .stroke();

        doc.font("Helvetica-Bold")
            .fontSize(18)
            .fillColor("#0369a1")
            .text("ACADEMY CERTIFICATE", pad, pad + 28, {
                width: width - pad * 2,
                align: "center",
            });

        doc.font("Helvetica-Bold")
            .fontSize(34)
            .fillColor("#0f172a")
            .text("Certificate of Completion", {
                width: width - pad * 2,
                align: "center",
            });

        doc.moveDown(1.4);

        doc.font("Helvetica")
            .fontSize(18)
            .fillColor("#334155")
            .text("This certifies that", {
                width: width - pad * 2,
                align: "center",
            });

        doc.moveDown(0.8);

        doc.font("Helvetica-Bold")
            .fontSize(28)
            .fillColor("#0f172a")
            .text(user.name, {
                width: width - pad * 2,
                align: "center",
            });

        doc.moveDown(0.8);

        doc.font("Helvetica")
            .fontSize(18)
            .fillColor("#334155")
            .text("has successfully completed the course", {
                width: width - pad * 2,
                align: "center",
            });

        doc.moveDown(0.8);

        doc.font("Helvetica-Bold")
            .fontSize(24)
            .fillColor("#0284c7")
            .text(course.title, {
                width: width - pad * 2,
                align: "center",
            });

        doc.moveDown(2);

        doc.font("Helvetica")
            .fontSize(14)
            .fillColor("#475569")
            .text(`Date: ${new Date().toLocaleDateString()}`, {
                width: width - pad * 2,
                align: "center",
            });

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
