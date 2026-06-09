import express from "express";
import {
  createStudent,
  createTeacher,
  createParent,
  mapTeacherStudent,
  mapParentStudent,
  bulkDeleteStudents,
  resetPassword,
  listStudents
} from "../controllers/schoolUser.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/student",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  createStudent
);

router.post("/teacher",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  createTeacher
);

router.post("/parent",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  createParent
);

router.post("/map/teacher",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  mapTeacherStudent
);

router.post("/map/parent",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  mapParentStudent
);

router.post(
  "/student/bulk-delete",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  bulkDeleteStudents
);

router.post(
  "/reset-password",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  resetPassword
);

router.get(
  "/students",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  listStudents
);

export default router;
