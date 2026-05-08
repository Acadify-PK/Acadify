import User from "../models/User.js";
import { pushExternalNotification } from "../services/notification.service.js";
import { getAuthUrl, getTokensFromCode } from "../services/googleCalendar.service.js";

export const updateIntegrations = async (req, res) => {
  try {
    const { slackWebhook, discordWebhook, googleCalendarEnabled } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (slackWebhook !== undefined) user.integrations.slackWebhook = slackWebhook;
    if (req.body.slackEnabled !== undefined) user.integrations.slackEnabled = req.body.slackEnabled;
    if (discordWebhook !== undefined) user.integrations.discordWebhook = discordWebhook;
    if (req.body.discordEnabled !== undefined) user.integrations.discordEnabled = req.body.discordEnabled;
    if (googleCalendarEnabled !== undefined) user.integrations.googleCalendarEnabled = googleCalendarEnabled;

    await user.save();
    
    res.json({
      message: "Integrations updated successfully",
      integrations: user.integrations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIntegrations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("integrations");
    res.json(user.integrations || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const testIntegration = async (req, res) => {
  try {
    const { type } = req.body; // 'slack' or 'discord'
    const user = await User.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const message = `🚀 Acadify Test Notification: Your ${type} integration is working correctly!`;
    
    // We bypass the global enabled/disabled check for the manual test button 
    // to ensure the user can verify their URL even if they haven't "enabled" it yet.
    if (type === "slack" && user.integrations.slackWebhook) {
        const axios = (await import("axios")).default;
        await axios.post(user.integrations.slackWebhook, { 
            attachments: [{
                color: "#3b82f6",
                title: "🚀 Test Successful",
                text: message,
                footer: "Acadify Integrations",
                ts: Math.floor(Date.now() / 1000)
            }]
        });
    } else if (type === "discord" && user.integrations.discordWebhook) {
        const axios = (await import("axios")).default;
        await axios.post(user.integrations.discordWebhook, { 
            embeds: [{
                title: "🚀 Test Successful",
                description: message,
                color: 5814783,
                footer: { text: "Acadify Integrations" },
                timestamp: new Date().toISOString()
            }]
        });
    } else {
        return res.status(400).json({ message: `No webhook configured for ${type}` });
    }

    res.json({ message: `Test message sent to ${type}!` });
  } catch (error) {
    res.status(500).json({ message: `Test failed: ${error.message}` });
  }
};

export const initiateGoogleAuth = async (req, res) => {
  try {
    const url = getAuthUrl();
    // In a real app, you might want to attach the userId to the state parameter
    // so we can identify the user in the callback.
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  // We need to know which user this is. 
  // For simplicity since we're in a single-user simulation context, 
  // but in production we'd use 'state' or session cookie.
  try {
    const tokens = await getTokensFromCode(code);
    
    // We update the user with these tokens
    // Note: You'll need a way to correlate this request back to the logged-in user.
    // If you're calling this from the browser, the 'protect' middleware should handle it
    // IF the callback doesn't lose the cookie.
    
    if (!req.user) return res.status(401).send("Unauthorized");

    const user = await User.findById(req.user._id);
    user.integrations.googleAccessToken = tokens.access_token;
    if (tokens.refresh_token) user.integrations.googleRefreshToken = tokens.refresh_token;
    user.integrations.googleIdToken = tokens.id_token;
    user.integrations.googleCalendarEnabled = true;

    await user.save();

    res.send("<script>window.close();</script>"); // Close the popup
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
