import "./bootstrap.js";   // 👈 MUST BE FIRST

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import schoolRoutes from "./routes/school.routes.js";
import schoolUserRoutes from "./routes/schoolUser.routes.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import userChatRoutes from "./routes/userChat.routes.js";
import planRoutes from "./routes/plan.routes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import reportRoutes from "./routes/report.routes.js";
import monitorRoutes from "./routes/monitor.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import pageRoutes from "./routes/page.routes.js";

const app = express();

app.use(apiLimiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/school", schoolUserRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/usermsg", userChatRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/pages", pageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Stemify Backend Running 🚀" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Stemify backend running on port ${PORT}`);
});
