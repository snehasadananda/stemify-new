import { askAI } from "../services/ai.service.js";
import { checkAbuse } from "../services/abuse.service.js";
import { db } from "../config/db.js";
import { success } from "../utils/response.js";

export const chat = async (req, res) => {

  const { message } = req.body;
  const userId = req.user.userId;

  // ---- ABUSE CHECK ----
  const abuse = checkAbuse(message);

  await db.query(
    `INSERT INTO chats (user_id, message, type, flagged)
     VALUES (?, ?, 'QUESTION', ?)`,
    [userId, message, abuse.flagged ? 1 : 0]
  );

  if (abuse.flagged) {

    // notify parents / teachers
    await db.query(
      `INSERT INTO notifications
       (user_id, message)
       VALUES (?, ?)`,
      [userId, abuse.reason]
    );

    return res.json({
      success: false,
      message: "Message violates policy",
      reason: abuse.reason
    });
  }

  // ---- AI CALL ----
  const reply = await askAI(message);

  await db.query(
    `INSERT INTO chats (user_id, message, type)
     VALUES (?, ?, 'RESPONSE')`,
    [userId, reply]
  );

  return success(res, "ok", { response: reply });
};

export const history = async (req, res) => {

  const userId = req.user.userId;

  const [rows] = await db.query(
    `SELECT message, type, created_at
     FROM chats
     WHERE user_id = ?
     ORDER BY id ASC`,
    [userId]
  );

  return success(res, "history", rows);
};
