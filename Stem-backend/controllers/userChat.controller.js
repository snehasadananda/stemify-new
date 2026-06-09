import { db } from "../config/db.js";
import { success, error } from "../utils/response.js";

// -------- SEND MESSAGE --------
export const sendMessage = async (req, res) => {

  const senderId = req.user.userId;
  const { receiver_id, message } = req.body;

  if (!receiver_id || !message) {
    return error(res, "receiver and message required");
  }

  // Optional: verify relationship rules later
  await db.query(
    `INSERT INTO user_chats
     (sender_id, receiver_id, message)
     VALUES (?, ?, ?)`,
    [senderId, receiver_id, message]
  );

  return success(res, "sent");
};

// -------- GET CONVERSATION --------
export const getConversation = async (req, res) => {

  const userId = req.user.userId;
  const otherId = req.params.userId;

  const [rows] = await db.query(
    `SELECT sender_id, receiver_id, message, sent_at, is_read
     FROM user_chats
     WHERE 
      (sender_id = ? AND receiver_id = ?)
      OR
      (sender_id = ? AND receiver_id = ?)
     ORDER BY id ASC`,
    [userId, otherId, otherId, userId]
  );

  return success(res, "chat", rows);
};

// -------- MY CHAT LIST --------
export const myChats = async (req, res) => {

  const userId = req.user.userId;

  const [rows] = await db.query(
    `SELECT 
       u.id as user_id,
       u.name,
       MAX(c.sent_at) last_time
     FROM user_chats c
     JOIN users u
       ON (u.id = c.sender_id OR u.id = c.receiver_id)
     WHERE (c.sender_id = ? OR c.receiver_id = ?)
       AND u.id != ?
     GROUP BY u.id, u.name
     ORDER BY last_time DESC`,
    [userId, userId, userId]
  );

  return success(res, "list", rows);
};
