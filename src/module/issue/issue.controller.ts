import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    const payload:IIssue = {
      ...req.body,
      reporter_id : req.user?.id
    }
    const result = await issueService.createIssueIntoDB(payload);
    res.status(201).json({
      success: true,
      message: "Issues Created Successfully",
      data: result.rows[0]
    })
  } catch (error:any) {
    res.status(401).json({
      success: true,
      message: error.message
    })
  }
}

export const issueController = {
  createIssue,
}