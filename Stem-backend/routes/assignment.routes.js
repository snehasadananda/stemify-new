import express from "express";
import { upload } from "../middleware/upload.js";
import {
  createAssignment,
  submitAssignment,
  gradeAssignment,
  studentAssignments,
  teacherSubmissions
} from "../controllers/assignment.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Teacher creates
router.post(
  "/create",
  authenticate,
  allowRoles("TEACHER"),
  createAssignment
);

// Student save / submit
router.post(
  "/submit",
  authenticate,
  allowRoles("STUDENT"),
  submitAssignment
);

// Teacher grade
router.post(
  "/grade",
  authenticate,
  allowRoles("TEACHER"),
  gradeAssignment
);
router.get(
  "/student",
  authenticate,
  allowRoles("STUDENT"),
  studentAssignments
);

router.get(
  "/teacher",
  authenticate,
  allowRoles("TEACHER"),
  teacherSubmissions
);

router.get(
  "/teacher",
  authenticate,
  allowRoles("TEACHER"),
  teacherSubmissions
);

// ✅ JSON version – no multer
router.post(
  "/submit-json",
  authenticate,
  allowRoles("STUDENT"),
  submitAssignment
);

router.post(
  "/submit",
  authenticate,
  allowRoles("STUDENT"),
  upload.single("file"),
  submitAssignment
);

export default router;
