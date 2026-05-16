import { useState } from "react";
import toast from "react-hot-toast";
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
      const user = res.data;
      setUser(user);
      
      // Since it's a new registration, it's usually a student by default
      // but if the system supports instructor registration, we handle it here
      if (user.role === "admin") {
        navigate("/admin/moderation");
      } else if (user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
      toast.success("Account created successfully!");
    } catch (err) {
      if (err.response?.status !== 429) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Registration failed. Please check your details and try again.",
        );
      }
      console.error(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Visual Side */}
        <section className="relative hidden w-full flex-col justify-between bg-slate-900 dark:bg-black p-12 text-white lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop')] opacity-10 blur-sm grayscale" />
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-cyan-500">
              ACADIFY
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-black leading-tight sm:text-6xl">
              Your Journey <br />
              <span className="text-cyan-500">Starts Here.</span>
            </h2>
            <p className="mt-8 text-xl text-slate-400">
              Join Acadify to unlock premium courses, track your progress, and master new skills with industry experts.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Comprehensive Curriculum</p>
              <p className="text-xs text-slate-500">Structured paths for every skill level</p>
            </div>
          </div>
        </section>

        {/* Form Side */}
        <section className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-gray-900 px-6 py-12 sm:px-12 lg:bg-white lg:dark:bg-gray-950 lg:py-24 transition-colors">
          <div className="w-full max-w-sm">
            <div className="mb-10 lg:hidden">
              <Link to="/" className="text-2xl font-black tracking-tighter text-cyan-600 dark:text-cyan-500">
                ACADIFY
              </Link>
            </div>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-slate-500 dark:text-gray-400">Join our community of over 10,000+ students</p>

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="mt-8 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10 p-4 text-sm font-bold text-rose-700 dark:text-rose-400"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 lg:bg-slate-50 lg:dark:bg-gray-900/50 lg:focus:bg-white dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 lg:bg-slate-50 lg:dark:bg-gray-900/50 lg:focus:bg-white dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 lg:bg-slate-50 lg:dark:bg-gray-900/50 lg:focus:bg-white dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-cyan-600 py-5 text-sm font-black text-white shadow-lg shadow-cyan-900/20 transition hover:bg-cyan-500 active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-slate-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-black text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
