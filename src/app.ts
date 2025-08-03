import express from "express";
import { errorHandler } from "./common/errors/error-handler";
import e from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
import { deserializeUser } from "./common/middleware/deserlize-user.middleware";
import cors from "cors";
import config from "config";
import { CorsConfig, RateLimitConfig } from "./types/config.types";
import helmet from "helmet";
import compression from "compression";
import { rateLimiter } from "./common/middleware/rate-limiter.middleware";

const corsConfig = config.get<CorsConfig>("cors");

const app = express();

app.use(helmet());
app.use(compression());

app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(corsConfig));

app.use(deserializeUser);

app.get("/", (req, res) => {
  res.send("server is running!");
});

app.use("/api/v1", router);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
