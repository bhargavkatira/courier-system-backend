import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { redisConnection } from "./config/redis";
import orderRoutes from "./routes/ order.routes";
import trackingRoutes from "./routes/tracking.routes";
import { orderQueue } from "./services/queue.service";


dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT;

// connect DB
connectDB();

(async () => {
  await redisConnection.set("test", "hello");
  const val = await redisConnection.get("test");
  console.log("Redis test:", val);
})();


app.get("/", (req, res) => {
  res.send("Courier Backend Running 🚀");
});

app.listen(port, () => {
  console.log("Server running on port 3000");
});

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
  queues: [
    new BullMQAdapter(orderQueue),
  ],
  serverAdapter,
});
app.use("/admin/queues", serverAdapter.getRouter());

app.use("/api", orderRoutes);

app.use("/api/tracking", trackingRoutes);