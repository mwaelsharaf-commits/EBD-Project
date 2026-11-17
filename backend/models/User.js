import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: { type: String, required: true }, // "customer" or "business"
  businessName: { type: String }, // only for businesses
});

export default mongoose.model("User", userSchema);
