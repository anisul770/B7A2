import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db"
import type { IIssue } from "./issue.interface";

const createIssueIntoDB = async (payload: IIssue) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(`
    INSERT INTO issues (title,description,type,reporter_id)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `, [title, description, type, reporter_id]);
  return result
}

const getAllIssuesFromDB = async (sort: string, type: string, status: string) => {
  let query = 'created_at';
  let order = 'ASC';
  if (sort === 'newest') {
    order = 'DESC'
  }
  if (!type && !status) {
    return await pool.query(`
    SELECT * FROM issues
    ORDER BY ${query} ${order};
    `)
  } else if (type && !status) {
    return await pool.query(`
    SELECT * FROM issues
    WHERE type = $1
    ORDER BY ${query} ${order};
    `, [type]);
  } else if (!type && status) {
    return await pool.query(`
    SELECT * FROM issues
    WHERE status = $1
    ORDER BY ${query} ${order};
    `, [status]);
  } else {
    return await pool.query(`
    SELECT * FROM issues
    WHERE type=$1
    AND status = $2
    ORDER BY ${query} ${order};
    `, [type, status]);
  }
}

const getSingleIssueFromDB = async (id: number) => {
  const result = await pool.query(`
    SELECT * FROM issues
    WHERE id = $1
    `, [id]);
  if (result.rowCount === 0) {
    throw new Error('Issue not found');
  }
  return result;
}

const updateIssueIntoDB = async (id: number, payload: IIssue) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(`
    UPDATE issues
    SET
    title = COALESCE($1,title),
    description = COALESCE($2,description),
    type = COALESCE($3,type),
    status = COALESCE($4,status)
    WHERE id = $5 RETURNING *
    `, [title, description, type, status, id]);
  return result;
};

const deleteIssueFromDB = async (user: JwtPayload, id: string) => {
  if (user.role !== 'maintainer'){
    throw new Error('You are not allowed to delete');
  }
  const result = await pool.query(`
    DELETE FROM issues WHERE id=$1
    `,[id]);
  return result;
}

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB
}
