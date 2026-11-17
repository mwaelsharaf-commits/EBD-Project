import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects a route: reads the token, loads the user into req.user
export async function protect(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Please log in" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (!req.user) {
    return res.status(401).json({ error: "User no longer exists" });
  }
  next();
}