import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "../user/user.interface";
import jwt from 'jsonwebtoken';
import config from "../../config";


const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(`
      INSERT INTO users (name,email,password,role) 
      VALUES ($1,$2,$3,COALESCE($4,'contributor')) 
      RETURNING name,email,role`, [name, email, hashPassword, role]);
  return result;
};  

const loginUserIntoDB = async(payload : {email:string,password:string}) => {
  const {email,password} = payload;
  const userData = await pool.query(`
    SELECT * FROM users WHERE email=$1`,[email]);
  if(userData.rowCount === 0){
    throw new Error('No User Found with this email!');
  }
  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password,user.password)
  if(!matchPassword) {
    throw new Error("Invalid Password!!");
  }
  const jwtPayload = {
    id: user.id,
    name : user.name,
    role: user.role,
    email:user.email
  }
  const accessToken = jwt.sign(jwtPayload,config.secretKey as string,{
    expiresIn: '1d',
  })
  return {accessToken};
}

export const authService = {
  createUserIntoDB,
  loginUserIntoDB,
}