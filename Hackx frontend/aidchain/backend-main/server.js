import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.js";
import transactionsRouter from "./routes/transactions/index.js";
import milestoneRouter from "./routes/milestone/index.js";
import dashboardRouter from "./routes/dashboard/index.js";
import auditRouter from "./routes/audit/index.js";

dotenv.config();
const app = express();
connectDB();
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", transactionsRouter);       // POST /api/donate, GET /api/transactions
app.use("/api/milestone", milestoneRouter); // POST /api/milestone/verify
app.use("/api/dashboard", dashboardRouter); // GET /api/dashboard/status
app.use("/api/audit", auditRouter); // GET /api/audit/list (admin only)

app.get("/", (req, res) => {
  res.send("AidConnect API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
