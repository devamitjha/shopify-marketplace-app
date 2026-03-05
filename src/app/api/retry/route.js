import { orderQueue } from "@/lib/queue";
import { pool } from "@/lib/db";

export async function POST(req) {

  const { id } = await req.json();

  const result = await pool.query(
    "SELECT payload FROM order_logs WHERE id=$1",
    [id]
  );

  const order = result.rows[0].payload;

  await orderQueue.add("retry-order", order);

  return Response.json({ success: true });
}