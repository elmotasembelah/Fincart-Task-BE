import rateLimit from "express-rate-limit";
import config from "config";
import { RateLimitConfig } from "../../types/config.types";

const rateLimitConfig = config.get<RateLimitConfig>("rateLimit");

export const rateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: rateLimitConfig.message,
  standardHeaders: rateLimitConfig.standardHeaders,
  legacyHeaders: rateLimitConfig.legacyHeaders,
});
