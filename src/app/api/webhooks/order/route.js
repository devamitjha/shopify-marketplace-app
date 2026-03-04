import { orderQueue } from "@/lib/queue";

export async function POST(req) {

  const order = await req.json();

  console.log("Order received:", order.id);

  await orderQueue.add("new-order", order, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000
    }
  });

  return Response.json({ received: true });
}