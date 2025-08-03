require("dotenv").config();

module.exports = {
  dbUrl: process.env.MONGO_URL,
  port: process.env.PORT || 3000,
  JWT_Secret: process.env.JWT_SECRET,
  jwt: {
    accessTokenTtl: "15m",
    refreshTokenTtl: "7d",
  },
  cookie: {
    domain: "localhost",
    sameSite: "lax",
    secure: false,
    httpOnly: true,
    maxAge: {
      accessToken: 15 * 60 * 1000,
      refreshToken: 7 * 24 * 60 * 60 * 1000,
    },
  },
  aws: {
    s3: {
      bucketName: process.env.S3_BUCKET_NAME,
      region: process.env.S3_BUCKET_REGION,
      accessKeyId: process.env.AWS_USER_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_USER_SECRET_ACCESS_KEY,
      signedUrlExpiration: 3600,
    },
  },
  files: {
    images: {
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
      validExtentions: [".jpg", ".jpeg", ".png", ".webp"],
      maxSizeInBytes: 3 * 1024 * 1024,
    },
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  email: {
    service: "gmail",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  },
};
