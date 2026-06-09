import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { jwtConfig } from "../config/jwt.js";
import { comparePassword } from "../utils/hash.js";
import { success, error } from "../utils/response.js";
import requestIp from "request-ip";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return error(res, "Username and password required");
    }

    const [rows] = await db.query(
      `SELECT u.id, u.password, u.is_active, u.school_id, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.username = ? AND u.is_deleted = 0`,
      [username]
    );

    const clientIp = requestIp.getClientIp(req);

    if (rows.length === 0) {
      // log failed attempt
      await db.query(
        `INSERT INTO login_logs (user_id, ip, status)
         VALUES (NULL, ?, 'FAIL')`,
        [clientIp]
      );

      return error(res, "Invalid credentials", 401);
    }

    const user = rows[0];

    if (!user.is_active) {
      return error(res, "Account suspended. Contact admin.", 403);
    }

    const match = await comparePassword(password, user.password);

    // ---- LOG ATTEMPT ----
    await db.query(
      `INSERT INTO login_logs (user_id, ip, status)
       VALUES (?, ?, ?)`,
      [user.id, clientIp, match ? "SUCCESS" : "FAIL"]
    );

    // ---- BRUTE FORCE BLOCK ----
    if (!match) {

      const [[f]] = await db.query(
        `SELECT COUNT(*) c FROM login_logs
         WHERE ip=? AND status='FAIL'
         AND created_at > NOW() - INTERVAL 10 MINUTE`,
        [clientIp]
      );

      if (f.c >= 5) {
        await db.query(
          `INSERT INTO blocked_ips (ip, blocked_till)
           VALUES (?, NOW() + INTERVAL 30 MINUTE)`,
          [clientIp]
        );
      }

      return error(res, "Invalid credentials", 401);
    }

    // ---- CREATE TOKEN ----
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        schoolId: user.school_id || null
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return success(res, "Login successful", {
      token,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};
