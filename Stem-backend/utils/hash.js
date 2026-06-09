import bcrypt from "bcryptjs";

export const comparePassword = async (plain, hash) => {
  return await bcrypt.compare(plain, hash);
};
