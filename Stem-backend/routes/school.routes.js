import express from "express";
import { createSchool } from "../controllers/school.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  allowRoles("SUPER_ADMIN", "MARKETING"),
  createSchool
);

export default router;
