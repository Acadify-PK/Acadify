import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  User as UserIcon, 
  ArrowRight,
  Loader2,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";

const AdminInstituteModeration = () => {
    const [pending, setPending] = useState([]);
    const [verified, setVerified] = useState([]); // Added state for verified institutes
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState("pending"); // Added tab state

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [pendingRes, verifiedRes] = await Promise.all([
                axios.get("/institutes/pending"),
                axios.get("/institutes/all")
            ]);
            setPending(pendingRes.data);
            setVerified(verifiedRes.data.filter(i => i.isVerified));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async (id) => {
        if (!confirm("Are you sure you want to resend the approval email? This will NOT send a new temporary password for security reasons.")) return;
        
        setActionLoading(id);
        try {
            await axios.post(`/institutes/resend-email/${id}`);
            toast.success("Approval email resent successfully!");
        } catch (error) {
            toast.error("Failed to resend email");
        } finally {
            setActionLoading(null);
        }
    };

    const handleVerify = async (id, name) => {
        if (!confirm(`Are you sure you want to activate ${name}?`)) return;
        
        setActionLoading(id);
        try {
            await axios.patch(`/institutes/verify/${id}`);
            toast.success(`${name} activated successfully!`);
            setPending(pending.filter(i => i._id !== id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-cyan-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 sm:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                            <ShieldCheck className="text-cyan-500" size={36} />
                            Institute Moderation
                        </h1>
                        <p className="text-slate-500 dark:text-gray-400 font-medium mt-1">
                            Review and activate new campus requests.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold">
                            {pending.length}
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-400">Pending Requests</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab("pending")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}
                    >
                        Pending ({pending.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab("verified")}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'verified' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50'}`}
                    >
                        Verified ({verified.length})
                    </button>
                </div>

                {activeTab === "pending" ? (
                    pending.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-20 text-center border border-dashed border-slate-200 dark:border-white/10">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">All Caught Up!</h3>
                            <p className="text-slate-500 dark:text-gray-400">There are no pending institute applications at the moment.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pending.map((inst) => (
                                <div key={inst._id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-900/5 hover:border-cyan-500/30 transition-all group">
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                                <Building2 size={28} />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                <Clock size={12} /> Pending Activation
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{inst.name}</h3>
                                        <p className="text-cyan-500 text-sm font-bold mb-6">acadify.io/i/{inst.slug}</p>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                                                <UserIcon size={16} className="text-slate-400" />
                                                <span className="font-medium">{inst.ownerName}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="font-medium truncate">{inst.ownerEmail}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleVerify(inst._id, inst.name)}
                                            disabled={actionLoading === inst._id}
                                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {actionLoading === inst._id ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                            Activate Campus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    verified.length === 0 ? (
                        <div className="text-center p-20">
                            <p className="text-slate-500">No verified institutes yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {verified.map((inst) => (
                                <div key={inst._id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-900/5 transition-all group">
                                    <div className="p-8">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-cyan-50 dark:bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500">
                                                <Building2 size={28} />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                <CheckCircle2 size={12} /> Active
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{inst.name}</h3>
                                        <p className="text-cyan-500 text-sm font-bold mb-6">acadify.io/i/{inst.slug}</p>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                                                <Mail size={16} className="text-slate-400" />
                                                <span className="font-medium truncate">{inst.ownerEmail}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleResendEmail(inst._id)}
                                            disabled={actionLoading === inst._id}
                                            className="w-full bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold py-4 rounded-2xl border border-slate-100 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {actionLoading === inst._id ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                                            Resend Approval Email
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminInstituteModeration;
