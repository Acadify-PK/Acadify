import Institute from "../models/Institute.js";
import User from "../models/User.js";
import { sendInstituteApprovalEmail } from "../services/email.service.js";

export const registerInstitute = async (req, res) => {
    try {
        const { name, slug, description, ownerEmail, ownerName } = req.body;
        
        // 1. Check if slug exists
        const existing = await Institute.findOne({ slug: slug.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Institute URL/Slug already taken" });

        // 2. Create Institute (Pending Verification)
        const institute = new Institute({
            name,
            slug: slug.toLowerCase(),
            ownerEmail,
            ownerName,
            owner: req.user ? req.user._id : null, // Link if already logged in
            config: { description },
            isVerified: false
        });

        // 3. Update User role if they were logged in
        if (req.user) {
            await User.findByIdAndUpdate(req.user._id, { 
                role: 'institute_admin',
                institute: institute._id 
            });
        }

        await institute.save();
        res.status(201).json({ 
            message: "Institute request submitted! We will contact you at " + ownerEmail + " once verified.",
            institute 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getInstituteDetails = async (req, res) => {
    try {
        const { slug } = req.params;
        const institute = await Institute.findOne({ slug });
        if (!institute) return res.status(404).json({ message: "Institute not found" });
        res.json(institute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN ONLY: Get all pending activation requests
 */
export const getPendingInstitutes = async (req, res) => {
    try {
        const pending = await Institute.find({ isVerified: false }).sort({ createdAt: -1 });
        res.json(pending);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN ONLY: Verify/Activate an institute
 */
export const verifyInstitute = async (req, res) => {
    try {
        const { id } = req.params;
        const institute = await Institute.findById(id);
        
        if (!institute) return res.status(404).json({ message: "Institute not found" });
        if (institute.isVerified) return res.status(400).json({ message: "Institute is already verified" });

        institute.isVerified = true;
        await institute.save();

        // Send Approval Email via Resend
        await sendInstituteApprovalEmail(
            institute.ownerEmail,
            institute.ownerName,
            institute.name,
            institute.slug
        );

        res.json({ message: `${institute.name} has been activated!`, institute });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

