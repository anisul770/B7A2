import { pool } from "../../db"

const createIssueIntoDB = async(payload:any) => {
  const result = pool.query(`
    INSERT INTO issues ()
    `)
}

