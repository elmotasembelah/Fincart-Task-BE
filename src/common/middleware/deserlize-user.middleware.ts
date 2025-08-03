import { Request, Response, NextFunction } from "express";
import { get } from "lodash";
import { verifyJWT, signJWT } from "../security/jwt";
import config from "config";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      get(req, "cookies.accessToken") ||
      get(req, "headers.authorization", "").replace(/^Bearer\s/, "");

    const refreshToken =
      get(req, "cookies.refreshToken") || get(req, "headers.x-refresh");

    let decoded: unknown;
    let expired = false;

    if (accessToken) {
      const result = verifyJWT(accessToken);
      decoded = result.decoded;
      expired = result.expired;
    }

    if (decoded && typeof decoded === "object") {
      res.locals.user = decoded;
      return next();
    }

    if (refreshToken) {
      const { decoded: refreshDecoded, valid } = verifyJWT(refreshToken);

      if (valid && refreshDecoded && typeof refreshDecoded === "object") {
        const newAccessToken = signJWT(
          { id: refreshDecoded.id, role: refreshDecoded.role },
          { expiresIn: config.get("jwt.accessTokenTtl") }
        );

        res.cookie("accessToken", newAccessToken, {
          maxAge: config.get("cookie.maxAge.accessToken"),
          httpOnly: true,
          sameSite: config.get("cookie.sameSite"),
          secure: config.get("cookie.secure"),
          domain: config.get("cookie.domain"),
          path: "/",
        });

        res.setHeader("x-access-token", newAccessToken);
        res.locals.user = refreshDecoded;
        return next();
      }
    }

    return next();
  } catch (err) {
    return next();
  }
};
