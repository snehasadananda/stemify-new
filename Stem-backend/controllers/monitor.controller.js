import { db } from "../config/db.js";
import { success } from "../utils/response.js";
import {
  getGpuStats,
  getQueueHealth,
  getLatency
} from "../services/monitor.service.js";

// ---- DASHBOARD ----
export const systemDashboard = async (req, res) => {

  const gpu = await getGpuStats();
  const queue = await getQueueHealth();
  const latency = await getLatency();

  return success(res, "monitor", {
    gpu,
    queue,
    latency
  });
};

// ---- ERROR LOGS ----
export const errorLogs = async (req, res) => {

  const [rows] = await db.query(
    "SELECT * FROM system_errors ORDER BY id DESC LIMIT 200"
  );

  return success(res, "errors", rows);
};

// ---- PEAK USAGE ----
export const peakUsage = async (req, res) => {

  const [rows] = await db.query(
    `SELECT hour, SUM(count) total
     FROM usage_metrics
     GROUP BY hour
     ORDER BY total DESC`
  );

  return success(res, "peak", rows);
};
