import logger from "../common/logger/logger";
import { initBookingReminderJob } from "../modules/booking/jobs/booking-reminder.job";

export const initCronJobs = () => {
  logger.info("Initializing scheduled jobs...");
  initBookingReminderJob();

  try {
    logger.info("Cron jobs initialized successfully.");
  } catch (err) {
    logger.error("Failed to initialize cron jobs:", err);
    process.exit(1);
  }
};
