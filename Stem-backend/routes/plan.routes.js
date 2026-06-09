import express from "express";
import {
  createPlan,
  setSchoolPrice,
  applyCoupon,
  calculateSchoolBill
} from "../controllers/plan.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// SUPER ADMIN
router.post(
  "/create",
  authenticate,
  allowRoles("SUPER_ADMIN"),
  createPlan
);

// SUPER ADMIN / MARKETING
router.post(
  "/school-price",
  authenticate,
  allowRoles("SUPER_ADMIN","MARKETING"),
  setSchoolPrice
);

// PUBLIC
router.post("/coupon", authenticate, applyCoupon);

// SCHOOL ADMIN
router.get(
  "/bill/:school_id",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  calculateSchoolBill
);

export default router;
