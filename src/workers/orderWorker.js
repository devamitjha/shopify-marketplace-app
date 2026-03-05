import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { connection } from "../lib/redis.js";
import { pool } from "../lib/db.js";
import { getMarketplaceToken } from "../services/authService.js";
import { sendOrderToMarketplace } from "../services/marketplaceService.js";
import { saveOrderLog } from "../services/logService.js";
import { buildMarketplacePayload } from "../lib/marketplacePayload.js";

console.log("Order Worker started...");

const worker = new Worker(
  "orders",
  async job => {

    const order = job.data;
    let payload = null;

    console.log("Processing order:", order.id);

    try {

      /**
       * Prevent duplicate orders
       */
      const existing = await pool.query(
        "SELECT id FROM order_logs WHERE order_id=$1 AND status='success' LIMIT 1",
        [order.id]
      );

      if (existing.rows.length) {
        console.log("Order already processed. Skipping:", order.id);
        return;
      }

      /**
       * Get ERP token
       */
      const token = await getMarketplaceToken();

      /**
       * Build ERP payload
       */
      payload = buildMarketplacePayload(order);

      console.log("Payload generated:");
      console.log(JSON.stringify(payload, null, 2));

      /**
       * Send order to ERP
       */
      const response = await sendOrderToMarketplace(payload, token);

      console.log("Order sent successfully");

      /**
       * Save success log
       */
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

      /**
       * Save failure log
       */
      await saveOrderLog({
        order_id: order.id,
        order_number: order.order_number,
        status: "failed",
        payload: payload,
        erp_response: error.response?.data || null,
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
  {
    connection,
    concurrency: 3
  }
);

/**
 * Worker Events
 */

worker.on("active", job => {
  console.log(`Job ${job.id} started`);
});

worker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed: ${err.message}`);
});