import express from "express";
import {
  savePage,
  getPage,
  listPages
} from "../controllers/page.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// SUPER ADMIN ONLY → EDIT
router.post(
  "/save",
  authenticate,
  allowRoles("SUPER_ADMIN"),
  savePage
);

// PUBLIC
router.get("/list", listPages);
router.get("/:slug", getPage);

export default router;
