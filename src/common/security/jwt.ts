import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import config from "config";

const JWT_SECRET = config.get<string>("JWT_Secret");

export const signJWT = (
  payload: string | object | Buffer,
  options?: SignOptions
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    ...(options && options),
  });
};

export const verifyJWT = (
  token: string
): {
  valid: boolean;
  expired: boolean;
  decoded: string | JwtPayload | null;
} => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};

export const decodeToken = (
  token: string
): null | string | { [key: string]: any } => {
  return jwt.decode(token);
};
