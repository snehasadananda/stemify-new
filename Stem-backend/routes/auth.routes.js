import express from "express";
import { login, register, verifyOtp } from "../controllers/auth.controller.js";
import { bruteGuard } from "../middleware/bruteGuard.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", bruteGuard, login);

export default router;
