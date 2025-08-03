export interface CookieConfig {
  domain: string;
  sameSite: "lax" | "strict" | "none";
  secure: boolean;
  httpOnly: boolean;
  maxAge: {
    accessToken: number;
    refreshToken: number;
  };
}

export interface CorsConfig {
  origin: string[] | string;
  credentials: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}
