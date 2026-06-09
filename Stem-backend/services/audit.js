import { db } from "../config/db.js";

export const audit = async (actor, action, target, detail) => {
await audit(
  req.user.userId,
  "PASSWORD_RESET",
  user_id,
  remark
);

await audit(
  req.user.userId,
  "USER_CREATED",
  newUserId,
  `role:${role}`
);

  await db.query(
    `INSERT INTO audit_logs
     (actor_id, action, target_id, detail)
     VALUES (?, ?, ?, ?)`,
    [actor, action, target, detail]
  );
};
