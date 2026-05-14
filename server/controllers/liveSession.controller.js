import LiveSession from "../models/LiveSession.js";
import Course from "../models/Course.js";

export const startLiveSession = async (req, res) => {
    try {
        const { courseId, title, roomName } = req.body;
        const instructorId = req.user.id;

        // Check if instructor owns the course
        const course = await Course.findOne({ _id: courseId, instructor: instructorId });
        if (!course) {
            return res.status(403).json({ message: "Not authorized to go live for this course" });
        }

        // Check if there's already an active live session
        const activeSession = await LiveSession.findOne({ course: courseId, status: 'live' });
        if (activeSession) {
            return res.status(400).json({ message: "A live session is already active for this course" });
        }

        const session = await LiveSession.create({
            course: courseId,
            instructor: instructorId,
            title,
            roomName,
            status: 'live'
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const endLiveSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const instructorId = req.user.id;

        const session = await LiveSession.findOneAndUpdate(
            { _id: sessionId, instructor: instructorId, status: 'live' },
            { status: 'ended', endTime: new Date() },
            { new: true }
        );

        if (!session) {
            return res.status(404).json({ message: "Active session not found or unauthorized" });
        }

        res.json({ message: "Live session ended", session });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLiveSession = async (req, res) => {
    try {
        const { courseId } = req.params;
        const session = await LiveSession.findOne({ course: courseId, status: 'live' })
            .populate('instructor', 'name avatar');
        
        res.json(session || null);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
