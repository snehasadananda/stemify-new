import { db } from "../config/db.js";
import { success, error } from "../utils/response.js";

// ---- CREATE PLAN (SUPER ADMIN) ----
export const createPlan = async (req, res) => {

  const { name, price, type } = req.body;

  await db.query(
    `INSERT INTO plans (name, price, type)
     VALUES (?, ?, ?)`,
    [name, price, type]
  );

  return success(res, "Plan created");
};

// ---- SET SCHOOL PRICE ----
export const setSchoolPrice = async (req, res) => {

  const { school_id, user_type, price, trial_days } = req.body;

  await db.query(
    `INSERT INTO school_pricing
     (school_id, user_type, price, trial_days)
     VALUES (?, ?, ?, ?)`,
    [school_id, user_type, price, trial_days]
  );

  return success(res, "School pricing set");
};

// ---- APPLY COUPON ----
export const applyCoupon = async (req, res) => {

  const { code } = req.body;

  const [[c]] = await db.query(
    `SELECT * FROM coupons
     WHERE code = ? AND used < max_use`,
    [code]
  );

  if (!c) return error(res, "Invalid coupon");

  return success(res, "valid", c);
};

// ---- CALCULATE SCHOOL BILL ----
export const calculateSchoolBill = async (req, res) => {

  const { school_id } = req.params;

  const [[count]] = await db.query(
    `SELECT COUNT(*) total
     FROM users
     WHERE school_id = ? AND is_deleted = 0`,
    [school_id]
  );

  const [[price]] = await db.query(
    `SELECT price FROM school_pricing
     WHERE school_id = ? AND user_type='STUDENT'`,
    [school_id]
  );

  const amount = count.total * (price?.price || 0);

  return success(res, "bill", { amount, users: count.total });
};
