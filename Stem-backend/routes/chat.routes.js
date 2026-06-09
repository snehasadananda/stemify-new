import express from "express";
import { chat, history  } from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, chat);
router.get("/history", authenticate, history);

export default router;
