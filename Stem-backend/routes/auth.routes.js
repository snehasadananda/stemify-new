import express from "express";
import { login } from "../controllers/auth.controller.js";
import { bruteGuard } from "../middleware/bruteGuard.js";

const router = express.Router();

router.post("/login", bruteGuard, login);

export default router;
