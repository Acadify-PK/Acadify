import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-12 text-slate-950 dark:text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <div className="w-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-2xl shadow-slate-200 dark:shadow-cyan-950/30 backdrop-blur transition-all">
          <Link to="/login" className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
            Acadify
          </Link>
          <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Reset your password
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-300">
            Enter the email tied to your account and we’ll show the recovery flow here.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-200">
              Recovery request submitted. If this were connected to email delivery, you would receive next steps shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="recovery-email" className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">
                  Email Address
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 dark:focus:ring-cyan-400/10"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-cyan-600 dark:bg-cyan-500 py-4 text-sm font-black text-white dark:text-slate-950 transition hover:bg-cyan-700 dark:hover:bg-cyan-400 shadow-lg shadow-cyan-600/20 dark:shadow-none"
              >
                Send recovery email
              </button>
            </form>
          )}

          <Link
            to="/login"
            className="mt-8 inline-flex text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            Back to login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
