import bcrypt from "bcryptjs";
import { db } from "../config/db.js";
import { generateSchoolCode } from "../utils/schoolCode.js";
import { success, error } from "../utils/response.js";

export const createSchool = async (req, res) => {
  try {
    const {
      school_name,
      email,
      phone,
      address,
      city,
      education_board,
      admin_name,
      admin_password
    } = req.body;

    if (!school_name || !email || !city || !admin_name || !admin_password) {
      return error(res, "Required fields missing");
    }

    // check duplicate school
    const [dup] = await db.query(
      "SELECT id FROM schools WHERE email = ?",
      [email]
    );

    if (dup.length > 0) {
      return error(res, "School already registered");
    }

    const schoolCode = await generateSchoolCode(city);

    // create school
    const [result] = await db.query(
      `INSERT INTO schools
      (school_name, email, phone, address, city, education_board, school_code, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        school_name,
        email,
        phone,
        address,
        city,
        education_board,
        schoolCode,
        req.user.userId
      ]
    );

    // create SCHOOL ADMIN USER
    const hashed = await bcrypt.hash(admin_password, 10);

    const [[role]] = await db.query(
      "SELECT id FROM roles WHERE name='SCHOOL_ADMIN'"
    );

    await db.query(
      `INSERT INTO users
      (role_id, name, username, password, school_id, created_by)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        role.id,
        admin_name,
        email,
        hashed,
        result.insertId,
        req.user.userId
      ]
    );

    // EMAIL LOGIC WILL BE ADDED LATER

    return success(res, "School created successfully", {
      schoolCode
    });

  } catch (err) {
    console.error(err);
    return error(res, "Server error", 500);
  }
};
