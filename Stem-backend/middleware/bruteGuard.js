import requestIp from "request-ip";
import { db } from "../config/db.js";

export const bruteGuard = async (req, res, next) => {

  const ip = requestIp.getClientIp(req);

  const [[b]] = await db.query(
    "SELECT * FROM blocked_ips WHERE ip=? AND blocked_till > NOW()",
    [ip]
  );

  if (b) {
    return res.status(429).json({
      success: false,
      message: "IP temporarily blocked due to failed logins"
    });
  }

  next();
};
