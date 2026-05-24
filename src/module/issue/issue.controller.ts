import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    const payload: IIssue = {
      ...req.body,
      reporter_id: req.user?.id
    }
    const result = await issueService.createIssueIntoDB(payload);
    res.status(201).json({
      success: true,
      message: "Issue Created Successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;
    const result = await issueService.getAllIssuesFromDB(sort as string, type as string, status as string);
    res.status(200).json({
      success: true,
      message: "All The issues are here",
      data: result.rows
    })
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

const getSingleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.getSingleIssueFromDB(Number(id));
    res.status(200).json({
      success : true,
      message : "Issue retrieved successfully",
      data : result.rows[0]
    })
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

export const issueController = {
  createIssue,
  getAllIssue,
  getSingleIssue
}