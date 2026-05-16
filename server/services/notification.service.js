import User from "../models/User.js";
import Notification from "../models/Notification.js";
import axios from "axios";

export const createNotification = async ({ recipient, sender, type, message, link, priority = "medium", metadata = {} }) => {
  try {
    const notification = await Notification.create({
      recipient,
      sender,
      type,
      message,
      link,
      priority,
      metadata,
    });

    // Also push to external integrations if applicable
    await pushExternalNotification(recipient, message);

    return notification;
  } catch (error) {
    console.error("Internal notification error", error);
  }
};

export const pushExternalNotification = async (recipientId, message) => {
  try {
    const user = await User.findById(recipientId).select("integrations");
    if (!user || !user.integrations) return;

    const { slackWebhook, slackEnabled, discordWebhook, discordEnabled } = user.integrations;

    // Push to Slack
    if (slackEnabled && slackWebhook) {
      axios.post(slackWebhook, {
        attachments: [
          {
            color: "#36a64f",
            title: "Acadify Notification",
            text: message,
            footer: "Acadify Learning Platform",
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      }).catch(err => console.error("Slack Push Failed", err.message));
    }

    // Push to Discord
    if (discordEnabled && discordWebhook) {
      axios.post(discordWebhook, {
        embeds: [
          {
            title: "🔔 New Notification",
            description: message,
            color: 5814783, // blurple
            footer: {
              text: "Acadify Learning Platform"
            },
            timestamp: new Date().toISOString()
          }
        ]
      }).catch(err => console.error("Discord Push Failed", err.message));
    }
  } catch (err) {
    console.error("External notification error", err);
  }
};
