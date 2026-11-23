
import express from "express";
import { connectDB } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import businessSlotRoutes from "./routes/businessSlotRoutes.js";

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use(express.json());

// =====================================
// ROUTES
// =====================================

// Home API
app.get("/", (req, res) => {
  res.send("Welcome to Forsa");
});

// Existing login and registration
app.use("/api/auth", authRoutes);

// Business slot management
app.use("/api/business-slots", businessSlotRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// =====================================
// START SERVER
// =====================================

await connectDB();

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
