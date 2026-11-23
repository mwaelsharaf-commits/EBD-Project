
import mongoose from "mongoose";

// Shared Slot model for Publish, Edit, Delete and Booking.

const slotSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    category: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },

    startTime: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0.01,
    },

    dealPrice: {
      type: Number,
      required: true,
      min: 0.01,
      validate: {
        validator(value) {
          return value < this.originalPrice;
        },
        message: "Deal price must be lower than original price.",
      },
    },

    totalSpots: {
      type: Number,
      required: true,
      min: 1,
    },

    spotsLeft: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Slot ||
  mongoose.model("Slot", slotSchema);
