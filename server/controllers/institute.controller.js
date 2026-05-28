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

        // 1. Find the user by ownerEmail
        let user = await User.findOne({ email: institute.ownerEmail });
        let isNewUser = false;
        let tempPasswordString = null;

        if (user) {
            // 2. If user exists, upgrade their role
            user.role = 'institute_admin';
            user.institute = institute._id;
            await user.save();
        } else {
            // 3. If user doesn't exist (Guest Signup), create a placeholder user
            isNewUser = true;
            tempPasswordString = Math.random().toString(36).slice(-8) + "!1A";
            
            user = new User({
                name: institute.ownerName,
                email: institute.ownerEmail,
                password: tempPasswordString, 
                role: 'institute_admin',
                institute: institute._id
            });
            await user.save();
            console.log("Created guest user. tempPasswordString is:", tempPasswordString);
        }

        console.log("Calling sendInstituteApprovalEmail with:", {
            email: institute.ownerEmail,
            isNewUser,
            hasTempPass: !!tempPasswordString,
            tempPassPreview: tempPasswordString ? tempPasswordString.substring(0, 3) + "..." : "NONE"
        });

        // Send Approval Email via Resend
        await sendInstituteApprovalEmail(
            institute.ownerEmail,
            institute.ownerName,
            institute.name,
            institute.slug,
            isNewUser,
            tempPasswordString
        );

        res.json({ message: `${institute.name} has been activated!`, institute });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN ONLY: Resend approval email
 */
export const resendApprovalEmail = async (req, res) => {
    try {
        const { id } = req.params;
        const institute = await Institute.findById(id);

        if (!institute) return res.status(404).json({ message: "Institute not found" });
        if (!institute.isVerified) return res.status(400).json({ message: "Institute is not yet verified" });

        // For existing users, we don't send a temp password
        // We just remind them they can login with their existing account
        await sendInstituteApprovalEmail(
            institute.ownerEmail,
            institute.ownerName,
            institute.name,
            institute.slug,
            false // isNewUser = false
        );

        res.json({ message: `Approval email resent to ${institute.ownerEmail}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * ADMIN ONLY: Get all institutes
 */
export const getAllInstitutes = async (req, res) => {
    try {
        const institutes = await Institute.find().sort({ createdAt: -1 });
        res.json(institutes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * INSTITUTE_ADMIN ONLY: Get current user's institute
 */
export const getMyInstitute = async (req, res) => {
    try {
        if (!req.user.institute) {
            return res.status(404).json({ message: "No institute linked to this user" });
        }
        const institute = await Institute.findById(req.user.institute);
        res.json(institute);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * INSTITUTE_ADMIN ONLY: Update institute branding/config
 */
export const updateInstituteBranding = async (req, res) => {
    try {
        const { name, description, logo, banner } = req.body;
        const institute = await Institute.findById(req.user.institute);

        if (!institute) return res.status(404).json({ message: "Institute not found" });

        if (name) institute.name = name;
        if (description) institute.config.description = description;
        if (logo) institute.config.logo = logo;
        if (banner) institute.config.banner = banner;

        await institute.save();
        res.json({ message: "Branding updated successfully", institute });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * INSTITUTE_ADMIN ONLY: Create/Invite instructors
 */
export const inviteInstructor = async (req, res) => {
    try {
        const { name, email } = req.body;
        const adminUser = req.user;

        if (!adminUser.institute) {
            return res.status(403).json({ message: "You must be linked to an institute to invite team members" });
        }

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User with this email already exists" });

        // Create new instructor
        const tempPassword = Math.random().toString(36).slice(-8) + "!1A";
        const instructor = new User({
            name,
            email,
            password: tempPassword,
            role: 'instructor',
            institute: adminUser.institute,
            onboardingCompleted: true // Instructors don't go through the admin onboarding
        });

        await instructor.save();

        // Send Welcome Email (Reuse the approval email service or create a specialized one)
        // For now, reuse sendInstituteApprovalEmail with a flag or similar
        await sendInstituteApprovalEmail(
            email,
            name,
            "Your Teaching Dashboard", // placeholder
            "campus", // placeholder
            true, // isNewUser
            tempPassword
        );

        res.status(201).json({ message: `Instructor ${name} invited successfully`, instructor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * INSTITUTE_ADMIN ONLY: Complete onboarding
 */
export const finalizeOnboarding = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.onboardingCompleted = true;
        await user.save();
        res.json({ message: "Onboarding finalized", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

