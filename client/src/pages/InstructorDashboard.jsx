import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const initialCourseForm = {
  title: "",
  description: "",
  price: "",
};

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [error, setError] = useState("");
  const [creatingCourse, setCreatingCourse] = useState(false);

  const handleCourseChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    try {
      setCreatingCourse(true);
      setError("");

      const res = await axios.post("/courses", {
        ...courseForm,
        price: Number(courseForm.price || 0),
      });

      navigate(`/instructor/course/${res.data._id}`);
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

  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Instructor Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Start a new course.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Create the course shell first. After it is saved, you will move
                into the builder to add sections and lectures.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 sm:px-8 lg:grid-cols-[minmax(0,520px)_1fr]">
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

          {error && (
            <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          )}

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
            <span className="text-sm font-semibold text-slate-700">Price</span>
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

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Authoring Flow
          </p>
          <h2 className="mt-2 text-xl font-bold">What happens next</h2>
          <div className="mt-5 space-y-3">
            {["Create the course", "Add sections", "Add lectures", "Review live structure"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-700 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {step}
                  </span>
                </div>
              ),
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default InstructorDashboard;
