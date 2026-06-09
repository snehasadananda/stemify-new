import express from "express";
import { studentProgress } from "../controllers/progress.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Teacher & Parent only
router.get(
  "/student/:studentId",
  authenticate,
  allowRoles("TEACHER", "PARENT", "SCHOOL_ADMIN"),
  studentProgress
);

export default router;
