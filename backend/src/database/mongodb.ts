import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";
import dotenv from "dotenv";

dotenv.config();

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export const connectToMongoDBTest = async () => {
    const testUri = process.env.MONGODB_TEST_URL as string;
    if (!testUri) {
        throw new Error("MONGODB_TEST_URL is not defined in .env file");
    }
    try {
        await mongoose.connect(testUri);
        console.log("Connected to MongoDB Test");
    } catch (error) {
        console.error("Error connecting to MongoDB Test:", error);
        throw error;
    }
};









