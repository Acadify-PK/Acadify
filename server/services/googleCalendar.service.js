import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // e.g. http://localhost:5000/api/integrations/google/callback
);

export const getAuthUrl = () => {
  const scopes = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    include_granted_scopes: true,
    prompt: "consent",
  });
};

export const getTokensFromCode = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

export const createCalendarEvent = async (user, eventDetails) => {
  if (!user.integrations?.googleRefreshToken) return;

  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  client.setCredentials({
    refresh_token: user.integrations.googleRefreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: client });

  const event = {
    summary: eventDetails.title,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime, // ISO String
      timeZone: "UTC",
    },
    end: {
      dateTime: eventDetails.endTime, // ISO String
      timeZone: "UTC",
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    return res.data;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw error;
  }
};
