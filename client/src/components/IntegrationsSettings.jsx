import { useState, useEffect } from "react";
import axios from "../api/axios";

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
  const [message, setMessage] = useState({ type: "", text: "" });

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
      setMessage({ type: "success", text: `Test message sent to ${type} successfully!` });
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || `Failed to send test to ${type}.` 
      });
    } finally {
      setTesting({ ...testing, [type]: false });
    }
  };

  const connectGoogle = async () => {
    try {
      const { data } = await axios.get("/integrations/google/auth");
      window.open(data.url, "_blank", "width=600,height=600");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to start Google Auth" });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.put("/integrations", integrations);
      setMessage({ type: "success", text: "Integrations updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update integrations." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading settings...</div>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm border mt-6">
      <h2 className="text-xl font-bold mb-4">External Integrations</h2>
      <p className="text-sm text-gray-600 mb-6">
        Receive notifications on Slack or Discord when your comments are moderated or when instructors respond.
      </p>

      {message.text && (
        <div className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Slack Integration</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.slackEnabled}
                onChange={(e) => setIntegrations({ ...integrations, slackEnabled: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              disabled={!integrations.slackEnabled}
              className="flex-grow border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 text-sm"
              placeholder="https://hooks.slack.com/services/..."
              value={integrations.slackWebhook}
              onChange={(e) => setIntegrations({ ...integrations, slackWebhook: e.target.value })}
            />
            <button
              type="button"
              onClick={() => handleTest("slack")}
              disabled={!integrations.slackWebhook || testing.slack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {testing.slack ? "..." : "Test"}
            </button>
          </div>
        </div>

        <div className="pb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Discord Integration</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={integrations.discordEnabled}
                onChange={(e) => setIntegrations({ ...integrations, discordEnabled: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="url"
              disabled={!integrations.discordEnabled}
              className="flex-grow border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-400 text-sm"
              placeholder="https://discord.com/api/webhooks/..."
              value={integrations.discordWebhook}
              onChange={(e) => setIntegrations({ ...integrations, discordWebhook: e.target.value })}
            />
            <button
              type="button"
              onClick={() => handleTest("discord")}
              disabled={!integrations.discordWebhook || testing.discord}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {testing.discord ? "..." : "Test"}
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 block">Google Calendar</label>
              <span className="text-xs text-gray-500">Sync course deadlines and scheduled lectures</span>
            </div>
            {integrations.googleCalendarEnabled ? (
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={connectGoogle}
                className="bg-white border hover:bg-gray-50 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/calendar_2020q4_48dp.png" className="w-4 h-4" alt="Google" />
                Connect
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {saving ? "Saving..." : "Save Integrations"}
        </button>
      </form>
    </div>
  );
}
