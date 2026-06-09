import { db } from "../config/db.js";
import { success } from "../utils/response.js";
import { Parser } from "json2csv";

// -------- SUPER ADMIN OVERVIEW --------
export const superOverview = async (req, res) => {

  const [[users]] = await db.query(`
    SELECT r.name role,
           COUNT(*) total,
           SUM(u.is_active=1) active,
           SUM(u.is_active=0) inactive
    FROM users u
    JOIN roles r ON r.id = u.role_id
    GROUP BY r.name
  `);

  const [[responses]] = await db.query(`
    SELECT COUNT(*) total
    FROM chats WHERE type='RESPONSE'
  `);

  const [[abuse]] = await db.query(`
    SELECT COUNT(*) total
    FROM chats WHERE flagged=1
  `);

  const [[revenue]] = await db.query(`
    SELECT 
      SUM(CASE WHEN status='PAID' THEN amount ELSE 0 END) received,
      SUM(CASE WHEN status='PENDING' THEN amount ELSE 0 END) pending,
      SUM(CASE WHEN status='REFUND' THEN amount ELSE 0 END) refund
    FROM payments
  `);

  return success(res, "overview", {
    users,
    responses: responses.total,
    abuse: abuse.total,
    revenue
  });
};

// -------- SCHOOL ADMIN REPORT --------
export const schoolReport = async (req, res) => {

  const schoolId = req.user.schoolId;

  const [[users]] = await db.query(`
    SELECT r.name role, COUNT(*) total
    FROM users u
    JOIN roles r ON r.id = u.role_id
    WHERE u.school_id=?
    GROUP BY r.name
  `, [schoolId]);

  const [[responses]] = await db.query(`
    SELECT COUNT(*) total
    FROM chats c
    JOIN users u ON u.id=c.user_id
    WHERE u.school_id=? AND c.type='RESPONSE'
  `, [schoolId]);

  const [[abuse]] = await db.query(`
    SELECT COUNT(*) total
    FROM chats c
    JOIN users u ON u.id=c.user_id
    WHERE u.school_id=? AND c.flagged=1
  `, [schoolId]);

  return success(res, "school", {
    users,
    responses: responses.total,
    abuse: abuse.total
  });
};

// -------- TOP 10 STUDENTS --------
export const topStudents = async (req, res) => {

  const schoolId = req.user.schoolId;

  const [rows] = await db.query(`
    SELECT u.name, sp.roll_no,
           COUNT(c.id) interactions
    FROM users u
    JOIN student_profiles sp ON sp.user_id=u.id
    LEFT JOIN chats c ON c.user_id=u.id
    WHERE u.school_id=?
    GROUP BY u.id
    ORDER BY interactions DESC
    LIMIT 10
  `, [schoolId]);

  return success(res, "top", rows);
};
// -------- TOP 10 TEACHERS --------
export const topTeachers = async (req, res) => {

  const schoolId = req.user.schoolId;

  const [rows] = await db.query(`
    SELECT u.name,
           tp.teacher_id,
           COUNT(DISTINCT ts.student_id) students_mapped,
           COUNT(c.id) interactions

    FROM users u
    JOIN teacher_profiles tp ON tp.user_id = u.id
    LEFT JOIN teacher_student_map ts 
           ON ts.teacher_id = u.id

    LEFT JOIN chats c 
           ON c.user_id = ts.student_id

    WHERE u.school_id = ?

    GROUP BY u.id
    ORDER BY interactions DESC
    LIMIT 10
  `, [schoolId]);

  return success(res, "top-teachers", rows);
};

export const topParents = async (req, res) => {
  const schoolId = req.user.schoolId;

  const [rows] = await db.query(`
    SELECT u.name,
           COUNT(ps.student_id) children,
           COUNT(c.id) interactions
    FROM users u
    JOIN parent_student_map ps ON ps.parent_id=u.id
    LEFT JOIN chats c ON c.user_id=ps.student_id
    WHERE u.school_id=?
    GROUP BY u.id
    ORDER BY interactions DESC
    LIMIT 10
  `,[schoolId]);

  return success(res,"top-parents",rows);
};

// -------- CSV EXPORT --------
export const exportUsersCsv = async (req, res) => {

  const [rows] = await db.query(`
    SELECT u.name, u.username, r.name role, u.is_active
    FROM users u
    JOIN roles r ON r.id=u.role_id
  `);

  const parser = new Parser();
  const csv = parser.parse(rows);

  res.header("Content-Type", "text/csv");
  res.attachment("users.csv");
  return res.send(csv);
};
