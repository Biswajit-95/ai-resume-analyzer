// import "dotenv/config";
// import { app } from "./app";
// import { env } from "./config";
// import { logger } from "./utils/logger";

// const port = env.PORT;

// app.get("/",(req,res)=>{
//     res.send("AI resume analyser backend running 🚀")
// })


// app.listen(port, () => {
//   logger.info(`Server listening on http://localhost:${port}`);
// });




import "dotenv/config";
import { app }    from "./app";
import { env }    from "./config";
import { logger } from "./utils/logger";
import mongoose   from "mongoose";

const port = env.PORT;

app.get("/", (_req, res) => {
  res.send("AI resume analyser backend running 🚀");
});

const server = app.listen(port, () => {
  logger.info(`Server listening on http://localhost:${port}`);
});

// ── Graceful shutdown ─────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received — shutting down`);

  server.close(async () => {
    logger.info("HTTP server closed");

    await mongoose.connection.close();
    logger.info("MongoDB connection closed");

    process.exit(0);
  });

  // force kill if shutdown hangs
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM")); // deployment restart
process.on("SIGINT",  () => shutdown("SIGINT"));  // Ctrl+C