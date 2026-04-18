import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db";
import { redisConnection } from "./config/redis";
import orderRoutes from "./routes/ order.routes";


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

app.use("/api", orderRoutes);