import logger from "./common/logger/logger";
import { errorHandler } from "./common/errors/error-handler";
import config from "config";
import { connectDatabase } from "./common/database/connect-database";
import app from "./app";
import { initCronJobs } from "./jobs/init-cron-jobs";

const port = config.get<number>("port");

process.once("uncaughtException", (err: Error) => {
  logger.info("Shutting down due to uncaught exception...");
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

const server = app.listen(port, async () => {
  await connectDatabase();
  initCronJobs();

  logger.info(`Server is listening on Port: ${port}`);
});

process.once("unhandledRejection", (reason: any) => {
  logger.info("Unhandled rejection detected. Shutting down...");
  logger.error(reason);
  server.close(() => {
    process.exit(1);
  });
});
