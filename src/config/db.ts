import mongoose from "mongoose";
import config from ".";

export const connectDB = async () => {
    try {
        const uri = config.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(uri);        
        console.log("MongoDB connected");
    } catch (err) {
        console.error("DB connection error", err);
        process.exit(1);
    }
};