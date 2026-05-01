import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes imports
import courseRoutes from "./routes/course.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import lectureRoutes from "./routes/lecture.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/courses", courseRoutes)
app.use("/api/sections", sectionRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/auth", authRoutes);

app.get("/api", (req, res) => {
  res.json({ message: "API running..." });
});

export default app;