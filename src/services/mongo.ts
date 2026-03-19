
import mongoose from "mongoose";
import { env } from "../config";

export const connectMongo = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,
    });

    console.log("✅ MongoDB connected successfully");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};