import type { NextFunction, Request, Response } from "express"
import { pool } from "../db";

const issueOwner = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const { id } = req.params;
      const { status } = req.body;
      const result = await pool.query(`
      SELECT reporter_id FROM issues
      WHERE id = $1
      `, [id]);
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Issue not found!!!"
        })
      }
      if (user?.id !== result.rows[0].reporter_id && user?.role === "contributor") {
        res.status(403).json({
          success: false,
          message: "You are not allowed to update this issue"
        })
      }
      if (status && user?.role === 'contributor') {
        res.status(403).json({
          success: false,
          message: "You are not allowed to update status"
        })
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default issueOwner;