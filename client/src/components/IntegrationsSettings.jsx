import { useState, useEffect } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Bell, Hash, MessageSquare, Calendar, Globe, AlertCircle, CheckCircle2, Loader2, Send, ChevronRight } from "lucide-react";

export default function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState({
    slackWebhook: "",
    slackEnabled: false,
    discordWebhook: "",
    discordEnabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState({ slack: false, discord: false });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      const { data } = await axios.get("/integrations");
      setIntegrations(data);
    } catch (err) {
      console.error("Failed to fetch integrations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (type) => {
    setTesting({ ...testing, [type]: true });
    try {
      await axios.post("/integrations/test", { type });
      toast.success(`Test message sent to ${type} successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to send test to ${type}.`);
    } finally {
      setTesting({ ...testing, [type]: false });
    }
  };

  const connectGoogle = async () => {
    try {
      const { data } = await axios.get("/integrations/google/auth");
      window.open(data.url, "_blank", "width=600,height=600");
    } catch (err) {
      toast.error("Failed to start Google Auth");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put("/integrations", integrations);
      toast.success("Integrations updated successfully!");
    } catch (err) {
      toast.error("Failed to update integrations.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm mt-6 transition-colors">
      <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-500 animate-spin mb-4" />
      <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your integrations...</p>
    </div>
  );

  return (
    <div className="max-w-3xl bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Globe className="w-7 h-7 text-blue-600 dark:text-blue-500" />
            External Integrations
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed max-w-md">
            Bridge your learning experience with your favorite tools. 
            Get instant updates on Slack, Discord, or stay organized with Google Calendar.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl transition-colors">
          <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Slack Section */}
        <div className="group bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-[1.5rem] border border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-600 transition-colors">
                <Hash className="w-5 h-5 text-[#E01E5A]" />
              </div>
              <div>
                <label className="text-base font-bold text-gray-800 dark:text-gray-200">Slack Notifications</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Post updates to a Slack channel</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.slackEnabled}
                onChange={(e) => setIntegrations({ ...integrations, slackEnabled: e.target.checked })}
              />
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
            </label>
          </div>
          
          <div className={`flex items-center gap-3 transition-all duration-300 ${integrations.slackEnabled ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none -translate-y-1'}`}>
            <input
              type="url"
              className="flex-grow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="https://hooks.slack.com/services/..."
              value={integrations.slackWebhook}
              onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
            />
            <button
              type="button"
              onClick={() => handleTest("slack")}
              disabled={!integrations.slackWebhook || testing.slack}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {testing.slack ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Test
            </button>
          </div>
        </div>

        {/* Discord Section */}
        <div className="group bg-gray-50/50 dark:bg-gray-800/50 p-6 rounded-[1.5rem] border border-transparent hover:border-blue-100 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-600 transition-colors">
                <MessageSquare className="w-5 h-5 text-[#5865F2]" />
              </div>
              <div>
                <label className="text-base font-bold text-gray-800 dark:text-gray-200">Discord Webhooks</label>
                <p className="text-xs text-gray-500 dark:text-gray-400">Send alerts to your Discord server</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.discordEnabled}
                onChange={(e) => setIntegrations({ ...integrations, discordEnabled: e.target.checked })}
              />
              <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 transition-colors"></div>
            </label>
          </div>
          
          <div className={`flex items-center gap-3 transition-all duration-300 ${integrations.discordEnabled ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none -translate-y-1'}`}>
            <input
              type="url"
              className="flex-grow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="https://discord.com/api/webhooks/..."
              value={integrations.discordWebhook}
              onChange={(e) => setIntegrations({ ...integrations, discordWebhook: e.target.value })}
            />
            <button
              type="button"
              onClick={() => handleTest("discord")}
              disabled={!integrations.discordWebhook || testing.discord}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {testing.discord ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Test
            </button>
          </div>
        </div>

        {/* Google Calendar Section */}
        <div className="p-6 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-black italic tracking-tight">Google Calendar</h3>
                <p className="text-blue-100 text-xs font-medium">Auto-sync course milestones & deadlines</p>
              </div>
            </div>
            
            {integrations.googleCalendarEnabled ? (
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-2 text-sm font-bold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <button
                type="button"
                onClick={connectGoogle}
                className="bg-white text-blue-700 px-6 py-2.5 rounded-xl text-sm font-black hover:bg-blue-50 transition-all shadow-xl shadow-black/10 flex items-center gap-2 active:scale-95"
              >
                Connect Now
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end border-t border-gray-100 dark:border-gray-800 gap-4 transition-colors">
          <button
            type="submit"
            disabled={saving}
            className="group relative bg-gray-900 dark:bg-gray-800 overflow-hidden text-white px-8 py-4 rounded-2xl font-black text-sm tracking-wide disabled:opacity-50 transition-all hover:pr-12 active:scale-95 shadow-xl shadow-black/10 dark:shadow-none"
          >
            <span className="relative z-10">{saving ? "PROCESSING..." : "SAVE PREFERENCES"}</span>
            {!saving && <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />}
          </button>
        </div>
      </form>
    </div>
  );
}
