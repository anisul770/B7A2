import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";

const getAllUsersFromDB = async (user: JwtPayload, id: string) => {
  if (user.role !== 'maintainer') {
    throw new Error('You are not allowed to view the user list');
  }
  const result = await pool.query(`
    SELECT * FROM users
    `);
  return result;
};

export const userService = {
  getAllUsersFromDB,
};