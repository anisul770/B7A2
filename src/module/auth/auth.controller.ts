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
    res.status(400).json({
      success: true,
      message: error.message
    })
  }
}

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const data = {
      token : result.accessToken,
      user : result.user
    }
    res.status(200).json({
      success: true,
      message: 'User Logged in',
      data: data
    })
  } catch (error: any) {
    res.status(401).json({
      success: true,
      message: error.message
    })
  }
}

export const authController = {
  createUser,
  loginUser,
}