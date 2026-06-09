import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { jwtConfig } from "../config/jwt.js";
import { comparePassword } from "../utils/hash.js";
import { success, error } from "../utils/response.js";
import requestIp from "request-ip";
import {
  createSignupChallenge,
  sendSignupOtpEmail,
  verifySignupOtp
} from "../services/signup.service.js";

const allowedSignupRoles = ["STUDENT", "TEACHER", "PARENT"];

const normalizeSignupIdentifier = (value) => value.trim().toLowerCase();

const isPhoneLike = (value) => /^[0-9+\-()\s]{7,}$/.test(value);

const buildAuthToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
      schoolId: user.school_id || null
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );

export const register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, role, schoolCode } = req.body;

    const identifier = normalizeSignupIdentifier(username || email || "");

    if (!identifier || !password || !confirmPassword || !role) {
      return error(res, "Email/phone, password, confirm password and role are required");
    }

    if (password !== confirmPassword) {
      return error(res, "Passwords do not match");
    }

    const normalizedRole = String(role).trim().toUpperCase();

    if (!allowedSignupRoles.includes(normalizedRole)) {
      return error(res, "Invalid signup role");
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE username = ? AND is_deleted = 0",
      [identifier]
    );

    if (existingUsers.length > 0) {
      return error(res, "User already exists");
    }

    let schoolId = null;

    if (schoolCode) {
      const normalizedSchoolCode = String(schoolCode).trim().toUpperCase();

      const [schoolRows] = await db.query(
        "SELECT id FROM schools WHERE school_code = ? LIMIT 1",
        [normalizedSchoolCode]
      );

      if (schoolRows.length === 0) {
        return error(res, "Invalid school code");
      }

      schoolId = schoolRows[0].id;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const { otp, identifier: signupKey } = await createSignupChallenge({
      identifier,
      passwordHash,
      role: normalizedRole,
      schoolId,
      name: identifier,
      phone: isPhoneLike(identifier) ? identifier : null
    });

    const mailResult = await sendSignupOtpEmail({ to: identifier, otp });

    return success(res, "OTP sent successfully", {
      identifier: signupKey,
      ...(mailResult.delivered ? {} : { debugOtp: otp })
    });
  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, username, otp } = req.body;
    const identifier = normalizeSignupIdentifier(username || email || "");

    if (!identifier || !otp) {
      return error(res, "Email/phone and OTP are required");
    }

    const verification = await verifySignupOtp(identifier, otp);

    if (!verification.ok) {
      if (verification.reason === "expired") {
        return error(res, "OTP expired. Please sign up again.", 400);
      }

      return error(res, "Invalid OTP", 400);
    }

    const { role, schoolId, passwordHash, name, phone } = verification.entry;

    const [[roleRow]] = await db.query(
      "SELECT id, name FROM roles WHERE name = ? LIMIT 1",
      [role]
    );

    if (!roleRow) {
      return error(res, "Role not configured", 400);
    }

    const [existingUsers] = await db.query(
      "SELECT id FROM users WHERE username = ? AND is_deleted = 0",
      [identifier]
    );

    if (existingUsers.length > 0) {
      return error(res, "User already exists", 400);
    }

    const [insertResult] = await db.query(
      `INSERT INTO users (role_id, name, username, phone, password, school_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [roleRow.id, name, identifier, phone, passwordHash, schoolId]
    );

    const [userRows] = await db.query(
      `SELECT u.id, u.school_id, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.id = ?`,
      [insertResult.insertId]
    );

    const user = userRows[0];
    const token = buildAuthToken(user);

    return success(res, "Signup completed", {
      token,
      user: {
        id: user.id,
        role: user.role.toLowerCase(),
        schoolId: user.school_id || null,
        username: identifier
      },
      redirectPath: "/chat"
    });
  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};

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
    const token = buildAuthToken(user);

    return success(res, "Login successful", {
      token,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};
