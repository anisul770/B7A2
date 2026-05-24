import type { Request, Response } from "express";

const createIssue = async (req: Request, res: Response) => {
  try {
    res.status(201).json({
      success: true,
      message: "Issues Created Successfully",
      data: req.user
    })
  } catch (error) {

  }
}

export const issueController = {
  createIssue,
}