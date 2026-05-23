import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "../user/user.interface";


const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(`
      INSERT INTO users (name,email,password,role) 
      VALUES ($1,$2,$3,COALESCE($4,'contributor')) 
      RETURNING name,email,role`, [name, email, hashPassword, role]);
  return result;
};  

export const authService = {
  createUserIntoDB,
}