import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const res = await axios.post("/auth/register", form);
      setUser(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please check your details and try again.",
      );
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fb] dark:bg-gray-950 text-slate-950 dark:text-white">
      <section className="mx-auto grid min-h-screen max-w-7xl px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-12">
        <div className="hidden flex-col justify-between py-10 lg:flex">
          <Link
            to="/"
            className="w-fit text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-500"
          >
            Acadify
          </Link>

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500">
              Start Learning
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight">
              Create your account and unlock a cleaner course workspace.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-gray-400">
              Join Acadify to enroll in courses, move through lectures, and
              keep your learning path organized from the first lesson.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-3">
            {["Enroll quickly", "Watch lessons", "Track content"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 text-sm font-semibold text-slate-700 dark:text-gray-300 shadow-sm transition hover:border-cyan-500/50"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm sm:p-8"
          >
            <div className="mb-8">
              <Link
                to="/"
                className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700 lg:hidden"
              >
                Acadify
              </Link>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                Create account
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-gray-400">
                Set up your learner profile and start browsing courses.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-md border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 px-4 py-3 text-sm font-medium text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}

            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                Full name
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Your name"
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/20"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                Email
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/20"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                placeholder="Create a password"
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-500 focus:border-cyan-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/20"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-cyan-700 dark:bg-cyan-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-cyan-800 dark:hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>

            <p className="mt-5 text-center text-sm text-slate-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-cyan-700 dark:text-cyan-500 hover:text-cyan-800 dark:hover:text-cyan-400"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Register;
