import mongoose from "mongoose";
import logger from "../logger/logger";
import config from "config";

const MONGO_URL = config.get<string>("dbUrl");
export const connectDatabase = async (): Promise<void> => {
  try {
    logger.info("Connecting to database...");
    await mongoose.connect(MONGO_URL);
    logger.info("database connected successfully");
  } catch (err) {
    logger.error("Database connection failed");
    logger.error(err);
    process.exit(1);
  }
};
