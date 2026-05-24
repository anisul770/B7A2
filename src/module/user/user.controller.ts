import type { Request, Response } from "express";
import { userService } from "./user.service";
import type { JwtPayload } from "jsonwebtoken";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await userService.getAllUsersFromDB(user as JwtPayload,id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
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