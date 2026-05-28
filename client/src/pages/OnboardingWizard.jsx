import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const OnboardingWizard = () => {
    const { setUser } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Step 1: Branding
    const [branding, setBranding] = useState({
        name: '',
        description: '',
        logo: '',
        banner: ''
    });

    useEffect(() => {
        const fetchInstitute = async () => {
            try {
                const { data } = await api.get('/institutes/my-institute');
                if (data) {
                    setBranding(prev => ({
                        ...prev,
                        name: data.name || '',
                        description: data.config?.description || '',
                        logo: data.config?.logo || '',
                        banner: data.config?.banner || ''
                    }));
                }
            } catch (err) {
                console.error("Error fetching institute for onboarding:", err);
            }
        };
        fetchInstitute();
    }, []);

    // Step 2: Team (Instructors)
    const [instructors, setInstructors] = useState([]);
    const [newInstructor, setNewInstructor] = useState({ name: '', email: '' });

    // Step 3: Social/Notifications
    const [integrations, setIntegrations] = useState({
        slackWebhook: '',
        discordWebhook: ''
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleBrandingSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/institutes/branding', branding);
            nextStep();
        } catch (err) {
            console.error(err);
            alert('Failed to update branding');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteInstructor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/institutes/invite-instructor', newInstructor);
            setInstructors([...instructors, newInstructor]);
            setNewInstructor({ name: '', email: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to invite instructor');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalize = async () => {
        setLoading(true);
        try {
            // Step 3: Integrations (reuse existing endpoint if available or partial update)
            await api.put('/integrations', integrations);
            // Finalize
            const { data } = await api.post('/institutes/finalize-onboarding');
            
            // Critical: Update the local auth state so ProtectedRoute sees the change
            if (data.user) {
                setUser(data.user);
            }
            
            navigate('/instructor');
        } catch (err) {
            console.error(err);
            alert('Finishing onboarding failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-8 text-white relative">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome to Acadify</h1>
                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Step {step} of 3</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-white transition-all duration-500 ease-out"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Set Up Your Institute Branding</h2>
                                <p className="text-slate-500 text-sm">How should students see your campus?</p>
                            </div>
                            
                            <form onSubmit={handleBrandingSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Campus Name</label>
                                    <input 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="e.g. Stanford University"
                                        value={branding.name}
                                        onChange={e => setBranding({...branding, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Tagline / Description</label>
                                    <textarea 
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24"
                                        placeholder="Briefly describe your institution..."
                                        value={branding.description}
                                        onChange={e => setBranding({...branding, description: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Logo URL</label>
                                        <input 
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={branding.logo}
                                            onChange={e => setBranding({...branding, logo: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Banner URL</label>
                                        <input 
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            value={branding.banner}
                                            onChange={e => setBranding({...branding, banner: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                                >
                                    {loading ? 'Saving...' : 'Save & Continue'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Invite Your Faculty</h2>
                                <p className="text-slate-500 text-sm">Add instructors who will create courses on your platform.</p>
                            </div>

                            <form onSubmit={handleInviteInstructor} className="flex gap-2">
                                <input 
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                    placeholder="Name"
                                    value={newInstructor.name}
                                    onChange={e => setNewInstructor({...newInstructor, name: e.target.value})}
                                    required
                                />
                                <input 
                                    className="flex-1 px-4 py-2 border rounded-lg"
                                    placeholder="Email"
                                    type="email"
                                    value={newInstructor.email}
                                    onChange={e => setNewInstructor({...newInstructor, email: e.target.value})}
                                    required
                                />
                                <button type="submit" className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200">
                                    Add
                                </button>
                            </form>

                            <div className="border rounded-lg divide-y bg-slate-50">
                                {instructors.length === 0 && (
                                    <div className="p-4 text-center text-slate-400 text-sm italic">
                                        No instructors added yet.
                                    </div>
                                )}
                                {instructors.map((ins, i) => (
                                    <div key={i} className="p-4 flex justify-between items-center text-sm">
                                        <span>{ins.name} ({ins.email})</span>
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Invited</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-3 border rounded-lg font-semibold hover:bg-slate-50">Back</button>
                                <button 
                                    onClick={nextStep} 
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Integrations (Optional)</h2>
                                <p className="text-slate-500 text-sm">Receive platform alerts via Slack or Discord.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Slack Webhook URL</label>
                                    <input 
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="https://hooks.slack.com/services/..."
                                        value={integrations.slackWebhook}
                                        onChange={e => setIntegrations({...integrations, slackWebhook: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Discord Webhook URL</label>
                                    <input 
                                        className="w-full px-4 py-2 border rounded-lg"
                                        placeholder="https://discord.com/api/webhooks/..."
                                        value={integrations.discordWebhook}
                                        onChange={e => setIntegrations({...integrations, discordWebhook: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button onClick={prevStep} className="flex-1 py-3 border rounded-lg font-semibold hover:bg-slate-50">Back</button>
                                <button 
                                    onClick={handleFinalize}
                                    disabled={loading}
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                                >
                                    {loading ? 'Finishing...' : 'Complete Setup'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;