import { orderQueue } from "@/lib/queue";
import { verifyShopifyWebhook } from "@/lib/verifyWebhook";

export async function POST(req) {

  const rawBody = await req.text();

  const hmacHeader = req.headers.get("x-shopify-hmac-sha256");

  // Only verify if Shopify header exists
  if (hmacHeader) {

    const isValid = verifyShopifyWebhook(rawBody, hmacHeader);

    if (!isValid) {
      console.log("Webhook HMAC verification failed");
      return new Response("Unauthorized", { status: 401 });
    }

  } else {

    console.log("⚠️ HMAC header missing (test request)");

  }

  const order = JSON.parse(rawBody);

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