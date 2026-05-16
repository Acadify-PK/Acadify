import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);

        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .status(201)
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isShadowBanned: user.isShadowBanned,
                isFlagged: user.isFlagged,
            });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.status === "blocked") {
            return res.status(403).json({ 
                message: "This account has been suspended for violating our terms of service." 
            });
        }

        const token = generateToken(user._id);

        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isShadowBanned: user.isShadowBanned,
                isFlagged: user.isFlagged,
            });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const me = (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        bio: req.user.bio,
        headline: req.user.headline,
        website: req.user.website,
        socialLinks: req.user.socialLinks,
        isShadowBanned: req.user.isShadowBanned,
        isFlagged: req.user.isFlagged,
    });
};

export const updateProfile = async (req, res) => {
    try {
        const { name, avatar, bio, headline, website, socialLinks } = req.body;
        const user = await User.findById(req.user._id);

        if (name) user.name = name.trim();
        
        // Basic sanitization for Avatar URL
        if (avatar !== undefined) {
            if (avatar === "") {
                user.avatar = "";
            } else if (avatar.startsWith('https://') || avatar.startsWith('http://') || avatar.startsWith('data:image/')) {
                user.avatar = avatar;
            }
        }

        if (bio !== undefined) user.bio = bio.substring(0, 500);
        if (headline !== undefined) user.headline = headline.substring(0, 100);
        
        if (website !== undefined) {
            if (website === "" || website.startsWith('http')) {
                user.website = website;
            }
        }

        if (socialLinks) {
            const sanitizedLinks = {};
            if (socialLinks.twitter) sanitizedLinks.twitter = socialLinks.twitter.startsWith('http') ? socialLinks.twitter : '';
            if (socialLinks.linkedin) sanitizedLinks.linkedin = socialLinks.linkedin.startsWith('http') ? socialLinks.linkedin : '';
            if (socialLinks.github) sanitizedLinks.github = socialLinks.github.startsWith('http') ? socialLinks.github : '';
            user.socialLinks = { ...user.socialLinks, ...sanitizedLinks };
        }

        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            bio: user.bio,
            headline: user.headline,
            website: user.website,
            socialLinks: user.socialLinks,
            isShadowBanned: user.isShadowBanned,
            isFlagged: user.isFlagged,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.json({ message: "Logged out" });
};
