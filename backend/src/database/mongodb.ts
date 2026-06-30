import mongoose from "mongoose";
import { MONGODB_URL } from "../configs/constant";

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
    const testUri = "mongodb://localhost:27017/agrokisan-db_test";
    try {
        await mongoose.connect(testUri);
        console.log("Connected to MongoDB Test");
    } catch (error) {
        console.error("Error connecting to MongoDB Test:", error);
        throw error;
    }
};