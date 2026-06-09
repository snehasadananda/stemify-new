import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { success, error } from "../utils/response.js";
import { canResetPassword } from "../services/passwordPolicy.js";

export const createStudent = async (req, res) => {
  try {
    const { name, roll_no, class_name, section, password } = req.body;

    if (!name || !roll_no || !class_name || !password) {
      return error(res, "Required fields missing");
    }

    const schoolId = req.user.schoolId;

    // Duplicate check
    const [dup] = await db.query(
      `SELECT sp.id FROM student_profiles sp
       JOIN users u ON u.id = sp.user_id
       WHERE sp.roll_no = ? AND u.school_id = ?`,
      [roll_no, schoolId]
    );

    if (dup.length > 0) {
      return error(res, "Roll number already exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const [[role]] = await db.query(
      "SELECT id FROM roles WHERE name='STUDENT'"
    );

    // create user
    const [user] = await db.query(
      `INSERT INTO users
      (role_id, name, username, password, school_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        role.id,
        name,
        roll_no,        // login via roll no
        hashed,
        schoolId,
        req.user.userId
      ]
    );

    // profile
    await db.query(
      `INSERT INTO student_profiles
      (user_id, roll_no, class, section)
      VALUES (?, ?, ?, ?)`,
      [user.insertId, roll_no, class_name, section]
    );

    return success(res, "Student created");

  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { name, teacher_id, handling_classes, password } = req.body;

    const schoolId = req.user.schoolId;

    const [dup] = await db.query(
      `SELECT id FROM teacher_profiles WHERE teacher_id = ?`,
      [teacher_id]
    );

    if (dup.length > 0) {
      return error(res, "Teacher ID exists");
    }

    const hashed = await bcrypt.hash(password, 10);

    const [[role]] = await db.query(
      "SELECT id FROM roles WHERE name='TEACHER'"
    );

    const [user] = await db.query(
      `INSERT INTO users
      (role_id, name, username, password, school_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [role.id, name, teacher_id, hashed, schoolId, req.user.userId]
    );

    await db.query(
      `INSERT INTO teacher_profiles
      (user_id, teacher_id, handling_classes)
      VALUES (?, ?, ?)`,
      [user.insertId, teacher_id, handling_classes]
    );

    return success(res, "Teacher created");

  } catch (err) {
    return error(res, "Server error", 500);
  }
};
export const createParent = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const schoolId = req.user.schoolId;

    const hashed = await bcrypt.hash(password, 10);

    const [[role]] = await db.query(
      "SELECT id FROM roles WHERE name='PARENT'"
    );

    const [user] = await db.query(
      `INSERT INTO users
      (role_id, name, username, phone, password, school_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        role.id,
        name,
        email,
        phone,
        hashed,
        schoolId,
        req.user.userId
      ]
    );

    await db.query(
      `INSERT INTO parent_profiles (user_id)
       VALUES (?)`,
      [user.insertId]
    );

    return success(res, "Parent created");

  } catch (err) {
    return error(res, "Server error", 500);
  }
};
export const mapTeacherStudent = async (req, res) => {
  const { teacher_id, student_id } = req.body;

  const schoolId = req.user.schoolId;

  await db.query(
    `INSERT INTO teacher_student_map
     (teacher_id, student_id, school_id)
     VALUES (?, ?, ?)`,
    [teacher_id, student_id, schoolId]
  );

  return success(res, "Mapped");
};
export const mapParentStudent = async (req, res) => {
  const { parent_id, student_id } = req.body;

  await db.query(
    `INSERT INTO parent_student_map
     (parent_id, student_id)
     VALUES (?, ?)`,
    [parent_id, student_id]
  );

  return success(res, "Mapped");
};

export const bulkDeleteStudents = async (req, res) => {
  try {
    const { class_name, section } = req.body;

    const schoolId = req.user.schoolId;

    await db.query(
      `UPDATE users u
       JOIN student_profiles sp ON sp.user_id = u.id
       SET u.is_deleted = 1
       WHERE u.school_id = ?
       AND sp.class = ?
       AND (? IS NULL OR sp.section = ?)`,
      [schoolId, class_name, section, section]
    );

    return success(res, "Students removed");

  } catch (err) {
    return error(res, "Server error", 500);
  }
};

export const resetPassword = async (req, res) => {

  const { user_id, new_password, remark } = req.body;

  if (!remark) {
    return error(res, "Remark is mandatory");
  }

  // --- WHO IS DOING RESET ---
  const actorRole = req.user.role;

  // --- GET TARGET USER ROLE ---
  const [[target]] = await db.query(
    `SELECT r.name as role
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.id = ?`,
    [user_id]
  );

  if (!target) {
    return error(res, "User not found");
  }

  // 🔐 SECURITY CHECK
  const allowed = canResetPassword(actorRole, target.role);

  if (!allowed) {
    return error(res,
      `Not authorized to reset password`
    );
  }
   // Prevent cross-school attack
if (actorRole === "SCHOOL_ADMIN") {

  const [[t]] = await db.query(
    "SELECT school_id FROM users WHERE id = ?",
    [user_id]
  );

  if (t.school_id !== req.user.schoolId) {
    return error(res, "Cannot modify other school users");
  }
}

  const hashed = await bcrypt.hash(new_password, 10);

  await db.query(
    `UPDATE users SET password = ? WHERE id = ?`,
    [hashed, user_id]
  );

  await db.query(
    `INSERT INTO password_remarks
     (user_id, remark, done_by)
     VALUES (?, ?, ?)`,
    [user_id, remark, req.user.userId]
  );

  return success(res, "Password reset done");
};

export const listStudents = async (req, res) => {

  const { class_name, section } = req.query;

  const schoolId = req.user.schoolId;

  const [rows] = await db.query(
    `SELECT u.id, u.name, sp.roll_no, sp.class, sp.section
     FROM users u
     JOIN student_profiles sp ON sp.user_id = u.id
     WHERE u.school_id = ?
     AND u.is_deleted = 0
     AND (? IS NULL OR sp.class = ?)
     AND (? IS NULL OR sp.section = ?)`,
    [schoolId, class_name, class_name, section, section]
  );

  return success(res, "list", rows);
};
