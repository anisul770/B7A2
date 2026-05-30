import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";
import type { JwtPayload } from "jsonwebtoken";

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
    const formattedIssues = await issueService.getAllIssueWithReporterFromDB(result.rows);
    res.status(200).json({
      success: true,
      message: "All The issues are here",
      data: formattedIssues
    })
  } catch (error: any) {
    res.status(400).json({
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
      success: true,
      message: "Issue retrieved successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message
    })
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.updateIssueIntoDB(Number(id), req.body);
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message
    })
  }
}

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const result = await issueService.deleteIssueFromDB(user as JwtPayload, id as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue Not Found",
      });
    }
    res.status(204).json({
      success: true,
      message: "Issue deleted successfully",
      data: result.rows[0],
    });
  } catch (error:any) {
    res.status(403).json({
      success: false,
      message: error.message,
    })
  }
}

export const issueController = {
  createIssue,
  getAllIssue,
  getSingleIssue,
  updateIssue,
  deleteIssue
}