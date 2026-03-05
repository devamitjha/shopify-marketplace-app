import { pool } from "@/lib/db";
import OrdersTable from "./OrdersTable";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {

  const result = await pool.query(`
    SELECT id, order_id, order_number, status
    FROM order_logs
    ORDER BY created_at DESC
    LIMIT 20
  `);

  const orders = result.rows;

  return (
    <div>
      <h1>Orders Dashboard</h1>

      <OrdersTable orders={orders} />
    </div>
  );
}