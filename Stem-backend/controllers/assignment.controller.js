import { db } from "../config/db.js";
import { success, error } from "../utils/response.js";

export const createAssignment = async (req, res) => {

  const { title, description, due_date, students } = req.body;

  const schoolId = req.user.schoolId;
  const teacherId = req.user.userId;

  const [result] = await db.query(
    `INSERT INTO assignments
    (teacher_id, school_id, title, description, due_date)
    VALUES (?, ?, ?, ?, ?)`,
    [teacherId, schoolId, title, description, due_date]
  );

  // create empty submissions for mapped students
  for (let sid of students) {
    await db.query(
      `INSERT INTO assignment_submissions
      (assignment_id, student_id)
      VALUES (?, ?)`,
      [result.insertId, sid]
    );
  }

  return success(res, "Assignment created");
};

export const submitAssignment = async (req, res) => {

  console.log("REQ BODY:", req.body);
  console.log("REQ FILE:", req.file);

  const body = req.body || {};

  const submission_id =
    body.submission_id ||
    body["submission_id"] ||
    null;

  const answer = body.answer || "";
  const action = body.action || "save";

  if (!submission_id) {
    return res.status(400).json({
      success: false,
      message: "submission_id required",
      received: body
    });
  }

  const filePath = req.file ? req.file.path : null;

  let status =
    action === "submit" ? "SUBMITTED" : "IN_PROGRESS";

  await db.query(
    `UPDATE assignment_submissions
     SET answer = ?, file_path = ?, status = ?,
         submitted_at = IF(?='SUBMITTED', NOW(), submitted_at)
     WHERE id = ?`,
    [answer, filePath, status, status, submission_id]
  );

  return res.json({
    success: true,
    message: "Updated"
  });
};

export const gradeAssignment = async (req, res) => {

  const { submission_id, marks, avatar_rank } = req.body;

  await db.query(
    `UPDATE assignment_submissions
     SET marks = ?, avatar_rank = ?
     WHERE id = ?`,
    [marks, avatar_rank, submission_id]
  );

  return success(res, "Graded");
};

export const studentAssignments = async (req, res) => {

  const studentId = req.user.userId;

  const [rows] = await db.query(
    `SELECT a.title, a.description, a.due_date,
            s.id as submission_id,
            s.status, s.marks, s.avatar_rank

     FROM assignment_submissions s
     JOIN assignments a ON a.id = s.assignment_id

     WHERE s.student_id = ?`,
    [studentId]
  );

  return success(res, "list", rows);
};
export const teacherSubmissions = async (req, res) => {

  const teacherId = req.user.userId;

  const [rows] = await db.query(
    `SELECT st.name, sp.roll_no,
            a.title,
            s.answer, s.status, s.marks

     FROM assignment_submissions s
     JOIN assignments a ON a.id = s.assignment_id
     JOIN users st ON st.id = s.student_id
     JOIN student_profiles sp ON sp.user_id = st.id

     WHERE a.teacher_id = ?`,
    [teacherId]
  );

  return success(res, "list", rows);
};
