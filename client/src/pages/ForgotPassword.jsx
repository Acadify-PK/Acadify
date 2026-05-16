import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Recovery instructions sent to your email!");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Visual Side */}
        <section className="relative hidden w-full flex-col justify-between bg-slate-900 dark:bg-black p-12 text-white lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165833767-027ffea10c37?q=80&w=2070&auto=format&fit=crop')] opacity-10 blur-sm grayscale" />
          <div className="relative z-10">
            <Link to="/" className="text-2xl font-black tracking-tighter text-cyan-500">
              ACADIFY
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <h2 className="text-5xl font-black leading-tight sm:text-6xl">
              Don't lose your <br />
              <span className="text-cyan-500">Momentum.</span>
            </h2>
            <p className="mt-8 text-xl text-slate-400">
              Recover your account in seconds and get back to mastering the skills that matter.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 border-t border-white/10 pt-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold">Secure Recovery</p>
              <p className="text-xs text-slate-500">Encrypted password reset protocols</p>
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

            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Reset Password</h1>
            <p className="mt-2 text-slate-500 dark:text-gray-400">Enter your email and we'll send you a link to get back into your account.</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2">
                <label htmlFor="recovery-email" className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Email Address</label>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 lg:bg-slate-50 lg:dark:bg-gray-900/50 lg:focus:bg-white dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-cyan-600 py-5 text-sm font-black text-white shadow-lg shadow-cyan-900/20 transition hover:bg-cyan-500 active:scale-95 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-10 flex flex-col items-center gap-4">
               <Link to="/login" className="text-sm font-bold text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Return to Sign In
               </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ForgotPassword;
