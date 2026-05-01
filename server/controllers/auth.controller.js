import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const me = (req, res) => {
    res.json(req.user);
}

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

        const token = generateToken(user._id);

        res
            .cookie("token", token, {
                httpOnly: true,
            })
            .json({
                _id: user._id,
                name: user.name,
                email: user.email,
            });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", { expires: new Date(0) });
    res.json({ message: "Logged out" });
};