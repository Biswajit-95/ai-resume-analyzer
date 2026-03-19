// import { Router } from "express";
// import leadRouter from "./lead";
// import uploadRouter from "./upload";
// import analyzeRouter from "./analyze";
// import analysisRouter from "./analysis";

// const router = Router();

// router.use("/lead", leadRouter);
// router.use("/upload-resume", uploadRouter);
// router.use("/analyze-resume", analyzeRouter);
// router.use("/analysis", analysisRouter);

// router.get("/health", (_req, res) => res.json({ ok: true }));

// export default router;

// import { Router } from "express";
// import leadRouter from "./lead";
// import analyzeRoutes from "./analyze";

// const router = Router();

// router.use("/leads", leadRouter);
// router.use("/analyze-resume",analyzeRoutes);

// export default router;

import { Router }   from "express";
import mongoose     from "mongoose";
import leadRoutes   from "./lead";
import analyzeRoutes from "./analyze";

const router = Router();

router.get("/health", async (_req, res) => {
  const checks: Record<string, string> = {
    server:  "ok",
    mongodb: "ok",
  };

  try {
    await mongoose.connection.db.admin().ping();
  } catch {
    checks.mongodb = "unreachable";
  }

  const isHealthy = Object.values(checks).every((v) => v === "ok");

  return res.status(isHealthy ? 200 : 503).json({
    status:    isHealthy ? "healthy" : "degraded",
    checks,
    uptime:    process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use("/analyze-resume", analyzeRoutes);
router.use("/leads", leadRoutes);

export default router;
