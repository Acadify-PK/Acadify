import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const initialCourseForm = {
  title: "",
  description: "",
  price: "",
};

const initialSectionForm = {
  title: "",
};

const initialLectureForm = {
  title: "",
  videoUrl: "",
  sectionId: "",
};

function InstructorDashboard() {
  const { user } = useAuth();

  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [sectionForm, setSectionForm] = useState(initialSectionForm);
  const [lectureForm, setLectureForm] = useState(initialLectureForm);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [creatingSection, setCreatingSection] = useState(false);
  const [creatingLecture, setCreatingLecture] = useState(false);

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
    setError("");
    setStatus("");
  };

  const handleSectionChange = (e) => {
    setSectionForm({ ...sectionForm, [e.target.name]: e.target.value });
    setError("");
    setStatus("");
  };

  const handleLectureChange = (e) => {
    setLectureForm({ ...lectureForm, [e.target.name]: e.target.value });
    setError("");
    setStatus("");
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      setCreatingCourse(true);
      setError("");
      setStatus("");

      const res = await axios.post("/courses", {
        ...courseForm,
        price: Number(courseForm.price || 0),
      });

      setCreatedCourse(res.data);
      setSections([]);
      setLectures([]);
      setSectionForm(initialSectionForm);
      setLectureForm(initialLectureForm);
      setStatus("Course created. Add sections next.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Course could not be created. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setCreatingCourse(false);
    }
  };

  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!createdCourse?._id) {
      setError("Create a course before adding sections.");
      return;
    }

    try {
      setCreatingSection(true);
      setError("");
      setStatus("");

      const res = await axios.post("/sections", {
        ...sectionForm,
        courseId: createdCourse._id,
      });

      setSections((current) => [...current, res.data]);
      setSectionForm(initialSectionForm);
      setLectureForm((current) => ({
        ...current,
        sectionId: current.sectionId || res.data._id,
      }));
      setStatus("Section added. You can now add lectures.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Section could not be created. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setCreatingSection(false);
    }
  };

  const handleCreateLecture = async (e) => {
    e.preventDefault();

    if (!lectureForm.sectionId) {
      setError("Choose a section before adding a lecture.");
      return;
    }

    try {
      setCreatingLecture(true);
      setError("");
      setStatus("");

      const res = await axios.post("/lectures", lectureForm);

      setLectures((current) => [...current, res.data]);
      setLectureForm({
        title: "",
        videoUrl: "",
        sectionId: lectureForm.sectionId,
      });
      setStatus("Lecture added to the selected section.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Lecture could not be created. Please try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setCreatingLecture(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Link
            to="/"
            className="inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            Back to courses
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Instructor Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Build a course from outline to lecture.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Create the course shell, add sections, then attach video
                lectures to each section.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-sm font-semibold text-slate-500">
                Signed in as
              </p>
              <p className="mt-1 font-bold text-slate-950">{user?.name}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid gap-5 lg:grid-cols-3">
          <form
            onSubmit={handleCreateCourse}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Step 1
            </p>
            <h2 className="mt-2 text-xl font-bold">Create Course</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add the public course details learners will see.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Course title
              </span>
              <input
                name="title"
                value={courseForm.title}
                placeholder="React Foundations"
                onChange={handleCourseChange}
                required
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={courseForm.description}
                placeholder="What students will learn"
                onChange={handleCourseChange}
                required
                rows={5}
                className="mt-2 w-full resize-none rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Price
              </span>
              <input
                name="price"
                type="number"
                min="0"
                value={courseForm.price}
                placeholder="0"
                onChange={handleCourseChange}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
              />
            </label>

            <button
              type="submit"
              disabled={creatingCourse}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-70"
            >
              {creatingCourse ? "Creating..." : "Create Course"}
            </button>
          </form>

          <form
            onSubmit={handleCreateSection}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Step 2
            </p>
            <h2 className="mt-2 text-xl font-bold">Add Section</h2>
            <p className="mt-1 text-sm text-slate-500">
              Group lessons into a clear course structure.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Section title
              </span>
              <input
                name="title"
                value={sectionForm.title}
                placeholder="Getting started"
                onChange={handleSectionChange}
                required
                disabled={!createdCourse}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={!createdCourse || creatingSection}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingSection ? "Adding..." : "Add Section"}
            </button>
          </form>

          <form
            onSubmit={handleCreateLecture}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Step 3
            </p>
            <h2 className="mt-2 text-xl font-bold">Add Lecture</h2>
            <p className="mt-1 text-sm text-slate-500">
              Attach a video lesson to one of your sections.
            </p>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Section
              </span>
              <select
                name="sectionId"
                value={lectureForm.sectionId}
                onChange={handleLectureChange}
                required
                disabled={sections.length === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Choose a section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Lecture title
              </span>
              <input
                name="title"
                value={lectureForm.title}
                placeholder="Welcome to the course"
                onChange={handleLectureChange}
                required
                disabled={sections.length === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700">
                Video URL
              </span>
              <input
                name="videoUrl"
                value={lectureForm.videoUrl}
                placeholder="https://example.com/video.mp4"
                onChange={handleLectureChange}
                required
                disabled={sections.length === 0}
                className="mt-2 w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </label>

            <button
              type="submit"
              disabled={sections.length === 0 || creatingLecture}
              className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingLecture ? "Adding..." : "Add Lecture"}
            </button>
          </form>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-5 xl:self-start">
          <h2 className="text-xl font-bold">Draft Summary</h2>

          {status && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {status}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Course
            </p>
            <h3 className="mt-2 font-bold text-slate-900">
              {createdCourse?.title || "No course created yet"}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {createdCourse?.description ||
                "Your newly created course will appear here."}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold">{sections.length}</p>
              <p className="mt-1 text-sm text-slate-500">Sections</p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-2xl font-bold">{lectures.length}</p>
              <p className="mt-1 text-sm text-slate-500">Lectures</p>
            </div>
          </div>

          {sections.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-bold text-slate-700">Sections</p>
              <div className="mt-2 space-y-2">
                {sections.map((section) => (
                  <div
                    key={section._id}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    {section.title}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

export default InstructorDashboard;
