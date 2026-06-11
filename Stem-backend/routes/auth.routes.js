import express from "express";
import { changePassword, login, register, verifyOtp } from "../controllers/auth.controller.js";
import { bruteGuard } from "../middleware/bruteGuard.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", bruteGuard, login);
router.post("/change-password", authenticate, changePassword);

export default router;
