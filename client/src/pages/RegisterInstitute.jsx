import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { Building2, Globe, Layout, CheckCircle2, ArrowRight, Loader2, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RegisterInstitute() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    ownerName: user?.name || "",
    ownerEmail: user?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") {
      const slugified = value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      setForm((prev) => ({ ...prev, [name]: slugified }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("/institutes/register", form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 shadow-2xl border border-slate-100 dark:border-white/5 space-y-6">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Request Received!</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">
            Awesome! Your request to launch <span className="text-cyan-500 font-bold">{form.name}</span> has been submitted.
            <br /><br />
            Our team will review your application and contact you at <span className="text-slate-900 dark:text-white font-bold">{form.ownerEmail}</span> with the next steps.
          </p>
          <button 
            onClick={() => navigate("/lms")}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl transition hover:scale-[1.02]"
          >
            Back to Acadify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 py-20">
      <div className="max-w-xl w-full">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 dark:border-white/5 overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Building2 size={32} />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                Launch Your Academy
              </h1>
              <p className="text-slate-500 dark:text-gray-400 font-medium">
                No account needed yet. Just tell us about your institute.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
                <CheckCircle2 size={18} className="rotate-45" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Your Full Name</label>
                  <input
                    required
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-500 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Contact Email</label>
                  <input
                    required
                    type="email"
                    name="ownerEmail"
                    value={form.ownerEmail}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Institute Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                    <Building2 size={18} />
                  </div>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Coding Hero Academy"
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-500 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">Subdomain / Slug</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                    <Globe size={18} />
                  </div>
                  <input
                    required
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="coding-hero"
                    className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-12 pr-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-500 dark:text-white"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 pl-2">
                  Proposed URL: <span className="text-cyan-500 font-bold">acadify.io/i/{form.slug || "slug"}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-gray-400">About the Institute</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe your academy's mission..."
                  className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-500 dark:text-white resize-none"
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-slate-950/10"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Submit Application"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
