import express from "express";
import {
  systemDashboard,
  errorLogs,
  peakUsage
} from "../controllers/monitor.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  authenticate,
  allowRoles("SUPER_ADMIN","SUB_ADMIN"),
  systemDashboard
);

router.get(
  "/errors",
  authenticate,
  allowRoles("SUPER_ADMIN","SUB_ADMIN"),
  errorLogs
);

router.get(
  "/peak",
  authenticate,
  allowRoles("SUPER_ADMIN","SUB_ADMIN"),
  peakUsage
);

export default router;
