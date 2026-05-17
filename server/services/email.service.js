import { Resend } from 'resend';

// NOTE: Ensure RESEND_API_KEY is in your server/.env file
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email to the institute owner when their institute is approved.
 * @param {string} toEmail - The email of the institute owner.
 * @param {string} ownerName - The name of the institute owner.
 * @param {string} instituteName - The name of the approved institute.
 * @param {string} slug - The slug/subdomain of the institute.
 */
export const sendInstituteApprovalEmail = async (toEmail, ownerName, instituteName, slug) => {
    try {
        const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;
        const instituteUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/i/${slug}`;

        const { data, error } = await resend.emails.send({
            from: 'Acadify <onboarding@resend.dev>', // Replace with your verified domain in production
            to: [toEmail],
            subject: `Welcome to the future of education: ${instituteName} is LIVE!`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                    <h2 style="color: #2563eb;">Congratulations, ${ownerName}!</h2>
                    <p style="font-size: 16px; color: #475569;">
                        Your application for <strong>${instituteName}</strong> has been approved. Your dedicated campus is now live and ready for students.
                    </p>
                    <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
                        <p style="margin-bottom: 20px; font-weight: bold; color: #1e293b;">Your campus URL:</p>
                        <a href="${instituteUrl}" style="font-size: 18px; color: #3b82f6; text-decoration: none; font-weight: bold;">${instituteUrl}</a>
                    </div>
                    <p style="color: #475569; line-height: 1.6;">
                        You can now log in to your account and start building your first course. If you applied as a guest, please use the email you registered with to create your account or log in.
                    </p>
                    <div style="margin-top: 40px; text-align: center;">
                        <a href="${loginUrl}" style="background-color: #0f172a; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    <hr style="margin-top: 40px; border: 0; border-top: 1px solid #e2e8f0;" />
                    <p style="font-size: 12px; color: #94a3b8; text-align: center;">
                        © 2026 Acadify LMS. All rights reserved.
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Email Service Error:", err);
        return { success: false, error: err.message };
    }
};
