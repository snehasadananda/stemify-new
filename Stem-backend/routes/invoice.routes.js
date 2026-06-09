import express from "express";
import { downloadInvoice } from "../controllers/invoice.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// School admin + accounts + super admin
router.get(
  "/:id",
  authenticate,
  allowRoles("SUPER_ADMIN","ACCOUNTS","SCHOOL_ADMIN"),
  downloadInvoice
);

export default router;
