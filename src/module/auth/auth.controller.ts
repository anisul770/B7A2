import type { Request, Response } from "express";
import { authService } from "./auth.service";


const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body)
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(401).json({
      success: true,
      message: 'failed',
      error: error
    })
  }
}

// const login = async(req:Request,res:Response) => {

// }

export const authController = {
  createUser,
}