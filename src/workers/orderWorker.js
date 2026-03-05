import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { connection } from "../lib/redis.js";
import { getMarketplaceToken } from "../services/authService.js";
import { sendOrderToMarketplace } from "../services/marketplaceService.js";
import { saveOrderLog } from "../services/logService.js";
import { buildMarketplacePayload } from "../lib/marketplacePayload.js";

console.log("Worker started...");
console.log("DB PASSWORD:", process.env.DB_PASSWORD);

const worker = new Worker(
  "orders",
  async job => {

    const order = job.data;
    let payload = null;

    console.log("Processing order:", order.id);

    try {

      const token = await getMarketplaceToken();

      payload = buildMarketplacePayload(order);

      console.log("Payload generated:");
      console.log(JSON.stringify(payload, null, 2));

      const response = await sendOrderToMarketplace(payload, token);

      console.log("Order sent successfully:", response);

      await saveOrderLog({
        order_id: order.id,
        order_number: order.order_number,
        status: "success",
        payload: payload,
        erp_response: response,
        error: null
      });

    } catch (error) {

      console.log("Order processing failed");

      await saveOrderLog({
        order_id: order.id,
        order_number: order.order_number,
        status: "failed",
        payload: payload,
        erp_response: null,
        error: error.message
      });

      if (error.response) {

        console.log("Status:", error.response.status);
        console.log(
          "Marketplace response:",
          JSON.stringify(error.response.data, null, 2)
        );

      } else {

        console.log("Error:", error.message);

      }

      throw error;
    }

  },
  { connection }
);

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});

worker.on("active", job => {
  console.log(`Job ${job.id} started`);
});