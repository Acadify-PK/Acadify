import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import User from "./models/User.js";
import Course from "./models/Course.js";
import Section from "./models/Section.js";
import Lecture from "./models/Lecture.js";
import Enrollment from "./models/Enrollment.js";
import Progress from "./models/Progress.js";
import Review from "./models/Review.js";

import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
    console.log("DB connected");
};

// 🎥 sample videos
const videoUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
];

const seed = async () => {
    try {
        await connectDB();

        console.log("Cleaning DB...");
        await Promise.all([
            User.deleteMany(),
            Course.deleteMany(),
            Section.deleteMany(),
            Lecture.deleteMany(),
            Enrollment.deleteMany(),
            Progress.deleteMany(),
            Review.deleteMany(),
        ]);

        // 👤 Create Users
        console.log("Creating users...");
        const instructors = [];
        const students = [];

        // Create Admin
        await User.create({
            name: "Admin User",
            email: "admin@acadify.com",
            password: "adminpassword",
            role: "admin",
        });

        // Create specific Instructor
        const testInstructor = await User.create({
            name: "Test Instructor",
            email: "instructor@acadify.com",
            password: "password123",
            role: "instructor",
        });
        instructors.push(testInstructor);

        for (let i = 0; i < 9; i++) {
            instructors.push(
                await User.create({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: "123456",
                    role: "instructor",
                })
            );
        }

        for (let i = 0; i < 100; i++) {
            students.push(
                await User.create({
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: "123456",
                    role: "student",
                })
            );
        }

        console.log("Users created");

        // 📚 Create Courses
        console.log("Creating courses...");
        const courses = [];

        for (let i = 0; i < 50; i++) {
            const instructor =
                instructors[Math.floor(Math.random() * instructors.length)];

            const course = await Course.create({
                title: faker.lorem.words(3),
                description: faker.lorem.paragraph(),
                price: faker.number.int({ min: 0, max: 100 }),
                instructor: instructor._id,
                published: Math.random() > 0.3,
            });

            courses.push(course);
        }

        console.log("Courses created");

        // 📂 Sections + Lectures
        console.log("Creating sections & lectures...");
        const allLectures = [];

        for (const course of courses) {
            const sectionCount = faker.number.int({ min: 2, max: 5 });

            for (let s = 0; s < sectionCount; s++) {
                const section = await Section.create({
                    title: faker.lorem.words(2),
                    course: course._id,
                    order: s,
                });

                const lectureCount = faker.number.int({ min: 3, max: 8 });

                for (let l = 0; l < lectureCount; l++) {
                    const lecture = await Lecture.create({
                        title: faker.lorem.words(4),
                        section: section._id,
                        videoUrl:
                            videoUrls[Math.floor(Math.random() * videoUrls.length)],
                        order: l,
                    });

                    allLectures.push({
                        lecture,
                        courseId: course._id,
                    });
                }
            }
        }

        console.log("Sections & lectures created");

        // 🎓 Enrollments
        console.log("Creating enrollments...");
        const enrollments = [];

        for (const student of students) {
            const randomCourses = faker.helpers.arrayElements(
                courses,
                faker.number.int({ min: 3, max: 10 })
            );

            for (const course of randomCourses) {
                const enrollment = await Enrollment.create({
                    user: student._id,
                    course: course._id,
                });

                enrollments.push({ student, course });
            }
        }

        console.log("Enrollments created");

        // 📈 Progress
        console.log("Creating progress...");
        for (const { student, course } of enrollments) {
            const courseLectures = allLectures.filter(
                (l) => l.courseId.toString() === course._id.toString()
            );

            const completed = faker.helpers.arrayElements(
                courseLectures,
                faker.number.int({
                    min: 1,
                    max: Math.floor(courseLectures.length * 0.7),
                })
            );

            for (const item of completed) {
                await Progress.create({
                    user: student._id,
                    course: course._id,
                    lecture: item.lecture._id,
                });
            }
        }

        console.log("Progress created");

        // ⭐ Reviews
        console.log("Creating reviews...");
        for (const { student, course } of enrollments.slice(0, 300)) {
            await Review.create({
                user: student._id,
                course: course._id,
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: faker.lorem.sentence(),
            });
        }

        console.log("Reviews created");

        console.log("✅ Seeding complete!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();