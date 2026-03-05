import { pool } from "@/lib/db";

export async function GET() {
  try {

    const result = await pool.query(
      "SELECT * FROM order_logs ORDER BY created_at DESC LIMIT 50"
    );

    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {

    console.error("Logs API Error:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch logs" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );

  }
}