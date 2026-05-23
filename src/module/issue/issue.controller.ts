import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {
  try {
    res.status(204).json({
      success: true,
      message: "Issues Created Successfully",
      data: "fdf"
    })
  } catch (error) {

  }
}

export const issueController = {
  createIssue,
}