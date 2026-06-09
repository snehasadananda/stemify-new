import { db } from "../config/db.js";

export const getStudentProgressData = async (studentId) => {

  const [[assignments]] = await db.query(
    `SELECT COUNT(*) total,
            SUM(status='SUBMITTED') submitted,
            AVG(marks) avg_marks
     FROM assignment_submissions
     WHERE student_id = ?`,
    [studentId]
  );

  const [[chat]] = await db.query(
    `SELECT COUNT(*) total_messages,
            SUM(type='QUESTION') questions
     FROM chats
     WHERE user_id = ?`,
    [studentId]
  );

  const [[abuse]] = await db.query(
    `SELECT COUNT(*) abuse_count
     FROM chats
     WHERE user_id = ? AND flagged = 1`,
    [studentId]
  );

  return {
    assignments,
    chat,
    abuse
  };
};
