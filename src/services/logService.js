import { pool } from "../lib/db.js";

export async function saveOrderLog(data) {

  const query = `
    INSERT INTO order_logs
    (order_id, order_number, status, payload, erp_response, error)
    VALUES ($1,$2,$3,$4,$5,$6)
  `;

  const values = [
    data.order_id,
    data.order_number,
    data.status,
    data.payload,
    data.erp_response,
    data.error
  ];

  await pool.query(query, values);
}