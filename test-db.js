import { pool } from "./src/lib/db.js";

const result = await pool.query("SELECT NOW()");

console.log(result.rows);