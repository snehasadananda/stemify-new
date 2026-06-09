import express from "express";
import {
  sendMessage,
  getConversation,
  myChats
} from "../controllers/userChat.controller.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// anyone logged in can use messenger
router.post("/send", authenticate, sendMessage);

router.get("/list", authenticate, myChats);

router.get("/with/:userId", authenticate, getConversation);

export default router;
