import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { connection } from "../lib/redis.js";
import { getMarketplaceToken } from "../services/authService.js";
import { sendOrderToMarketplace } from "../services/marketplaceService.js";
import { buildMarketplacePayload } from "../lib/marketplacePayload.js";

console.log("Worker started...");

const worker = new Worker(
  "orders",
  async job => {

    const order = job.data;

    console.log("Processing order:", order.id);

    try {

      const token = await getMarketplaceToken();

      const payload = buildMarketplacePayload(order);

      console.log("Payload generated:");
      console.log(JSON.stringify(payload, null, 2));

      const response = await sendOrderToMarketplace(payload, token);

      console.log("Order sent successfully:", response);

    } catch (error) {

      console.log("Order processing failed");

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log(
          "Marketplace response:",
          JSON.stringify(error.response.data, null, 2)
        );
      } else {
        console.log("Error:", error.message);
      }

    }

  },
  { connection }
);