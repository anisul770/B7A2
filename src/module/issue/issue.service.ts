import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db"
import type { IIssue, IResult } from "./issue.interface";

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

const getAllIssueWithReporterFromDB = async (issues: IResult[]) => {
  const reporterIds = [
    ...new Set(issues.map(issue => issue.reporter_id))
  ];
  
  const usersResult = await pool.query(`
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]);

  const userMap = new Map();

  usersResult.rows.forEach(user => {
    userMap.set(user.id, user);
  });

  const formattedIssues = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: userMap.get(issue.reporter_id),
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));
  return formattedIssues;
};

const getSingleIssueFromDB = async (id: number) => {
  let result = await pool.query(`
    SELECT * FROM issues
    WHERE id = $1
    `, [id]);
  if (result.rowCount === 0) {
    throw new Error('Issue not found');
  }
  const user = await pool.query(`
    SELECT * FROM users
    WHERE id = $1;
    `, [result.rows[0].reporter_id])
  const new_result = {
    id: result.rows[0].id,
    title: result.rows[0].title,
    description: result.rows[0].description,
    type: result.rows[0].type,
    status: result.rows[0].status,
    reporter: {
      id: user.rows[0].id,
      name: user.rows[0].name,
      role: user.rows[0].role
    },
    created_at: result.rows[0].created_at,
    updated_at: result.rows[0].updated_at
  }
  result.rows[0] = new_result;
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
  if (user.role !== 'maintainer') {
    throw new Error('You are not allowed to delete');
  }
  const result = await pool.query(`
    DELETE FROM issues WHERE id=$1
    `, [id]);
  return result;
}

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
  getAllIssueWithReporterFromDB
}
