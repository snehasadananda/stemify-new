import { db } from "../config/db.js";

export const generateSchoolCode = async (city) => {

  let prefix = "OTH";

  if (city) {
    prefix = city.substring(0, 3).toUpperCase();
  }

  const [rows] = await db.query(
    "SELECT school_code FROM schools WHERE school_code LIKE ? ORDER BY id DESC LIMIT 1",
    [`${prefix}%`]
  );

  let nextNumber = "000001";

  if (rows.length > 0) {
    const last = rows[0].school_code;
    const num = parseInt(last.substring(3)) + 1;
    nextNumber = num.toString().padStart(6, "0");
  }

  return prefix + nextNumber;
};
