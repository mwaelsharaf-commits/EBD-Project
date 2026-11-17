import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Never send the password hash to the client
function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    businessName: user.businessName,
  };
}

export async function register(req, res) {
  const { name, email, password, role, businessName } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Name, email, password and role are required" });
  }
  if (role !== "customer" && role !== "business") {
    return res.status(400).json({ error: "Role must be customer or business" });
  }
  if (role === "business" && !businessName) {
    return res.status(400).json({ error: "Business name is required" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    return res.status(409).json({ error: "This email is already registered" });
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role,
    businessName: role === "business" ? businessName : undefined,
  });

  res.status(201).json({ token: createToken(user), user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  res.json({ token: createToken(user), user: publicUser(user) });
}

export function me(req, res) {
  res.json({ user: publicUser(req.user) });
}