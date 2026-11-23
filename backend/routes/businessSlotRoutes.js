
import { Router } from "express";

import { protect } from "../middleware/auth.js";

import {
  getMySlots,
  updateSlot,
  deleteSlot,
} from "../controllers/businessSlotController.js";

const router = Router();

// =====================================
// BUSINESS ROLE CHECK
// =====================================

function requireBusiness(req, res, next) {
  if (req.user.role !== "business") {
    return res.status(403).json({
      error: "Only business accounts can manage slots.",
    });
  }

  next();
}

// All routes require login and business role
router.use(protect);
router.use(requireBusiness);

// =====================================
// SLOT MANAGEMENT ROUTES
// =====================================

// Display logged-in business's slots
router.get("/mine", getMySlots);

// Edit an existing slot
router.patch("/:id", updateSlot);

// Delete an existing slot
router.delete("/:id", deleteSlot);

export default router;
