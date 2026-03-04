import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const orderQueue = new Queue("orders", {
  connection
});