import express from "express";
import { connectDB } from "./db.js";

const app = express();

// ========== MIDDLEWARE ==========
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(express.json());

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.send("Welcome to Forsa");
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ========== START ==========
await connectDB();
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});