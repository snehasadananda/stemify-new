import { getStudentProgressData } from "../services/progress.service.js";
import { generateStudentSummary } from "../services/summary.service.js";
import { success } from "../utils/response.js";

export const studentProgress = async (req, res) => {

  const studentId = req.params.studentId;

  const data = await getStudentProgressData(studentId);
  const summary = await generateStudentSummary(data);

  return success(res, "progress", {
    raw: data,
    summary
  });
};
