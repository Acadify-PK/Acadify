import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
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
      const res = await axios.post("/auth/login", form);
      const user = res.data;
      setUser(user);
      
      // Role-based redirection
      if (user.role === "admin") {
        navigate("/admin/moderation");
      } else if (user.role === "instructor") {
        navigate("/instructor");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your details and try again.",
      );
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
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] opacity-10 blur-sm grayscale" />
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-cyan-500">
              ACADIFY
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-black leading-tight sm:text-6xl">
              Knowledge is the <br />
              <span className="text-cyan-500">Ultimate Leverage.</span>
            </h2>
            <p className="mt-8 text-xl text-slate-400">
              Sign in to resume your learning journey and bridge the gap between potential and mastery.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Turbocharge your career</p>
              <p className="text-xs text-slate-500">Access to 100+ premium industry courses</p>
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

            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="mt-2 text-slate-500 dark:text-gray-400">Enter your credentials to access your account</p>

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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Password</label>
                  <Link to="/forgot-password" className="text-xs font-bold text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400">Forgot?</Link>
                </div>
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
                {submitting ? "Verifying..." : "Sign In"}
              </button>
            </form>

            <p className="mt-10 text-center text-sm text-slate-500 dark:text-gray-400">
              New here?{" "}
              <Link to="/register" className="font-black text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
