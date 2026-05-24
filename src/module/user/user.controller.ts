import type { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows
    })
  } catch (error: any) {
    res.status(401).json({
      success: true,
      message: error.message
    })
  }
};

export const userController = {
  getAllUser
}