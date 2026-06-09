import express from "express";
import { createInternalUser } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/internal",
  authenticate,
  allowRoles("SUPER_ADMIN"),
  createInternalUser
);

export default router;
