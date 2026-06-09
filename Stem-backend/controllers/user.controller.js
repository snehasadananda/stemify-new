import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { success, error } from "../utils/response.js";

export const createInternalUser = async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
      return error(res, "All fields are required");
    }

    const allowedRoles = [
      "SUB_ADMIN",
      "MARKETING",
      "ACCOUNTS",
      "SUPPORT"
    ];

    if (!allowedRoles.includes(role)) {
      return error(res, "Invalid role for this operation");
    }

    const [existing] = await db.query(
      "SELECT id FROM users WHERE username = ? AND is_deleted = 0",
      [username]
    );

    if (existing.length > 0) {
      return error(res, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [[roleRow]] = await db.query(
      "SELECT id FROM roles WHERE name = ?",
      [role]
    );

    await db.query(
      `INSERT INTO users (role_id, name, username, password, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [roleRow.id, name, username, hashedPassword, req.user.userId]
    );

    return success(res, "User created successfully");

  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};
