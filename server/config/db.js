import mongoose from "mongoose";
import 'dotenv/config';

if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1); // Exit the process with failure
}

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }
    
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        isConnected = db.connections[0].readyState;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Don't exit process in serverless, let the error bubble up
        throw error;
    }
}