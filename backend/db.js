import mongoose from "mongoose";

export async function connectDB() {
  // Atlas is far away: this can take a few seconds
  console.log("Connecting to MongoDB...");
  // The connection string, from .env
  const uri = process.env.MONGODB_URI;
  // dbName picks the database inside your cluster
  await mongoose.connect(uri, { dbName: "forsa" });
  console.log("Connected to MongoDB");
}