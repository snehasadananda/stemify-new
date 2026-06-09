import express from "express";
import {
  superOverview,
  schoolReport,
  topStudents,
  topTeachers,
  topParents,
  exportUsersCsv
} from "../controllers/report.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// SUPER ADMIN & ACCOUNTS
router.get(
  "/overview",
  authenticate,
  allowRoles("SUPER_ADMIN","ACCOUNTS"),
  superOverview
);

// SCHOOL ADMIN
router.get(
  "/school",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  schoolReport
);

router.get(
  "/top-students",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  topStudents
);

router.get(
  "/top-teachers",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  topTeachers
);

router.get(
  "/top-parents",
  authenticate,
  allowRoles("SCHOOL_ADMIN"),
  topParents
);
// CSV EXPORT
router.get(
  "/export/users",
  authenticate,
  allowRoles("SUPER_ADMIN","ACCOUNTS"),
  exportUsersCsv
);

export default router;
