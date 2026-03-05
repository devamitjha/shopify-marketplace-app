import pkg from "pg";
const { Pool } = pkg;
console.log("DB PASSWORD:", process.env.DB_PASSWORD);
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
});

export async function saveOrderLog(data) {
  const query = `
    INSERT INTO order_logs
    (order_id, order_number, status, payload, erp_response, error)
    VALUES ($1,$2,$3,$4,$5,$6)
  `;

  await pool.query(query, [
    data.order_id,
    data.order_number,
    data.status,
    JSON.stringify(data.payload),
    JSON.stringify(data.erp_response),
    data.error
  ]);
}

