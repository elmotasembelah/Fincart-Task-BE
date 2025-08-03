import { Response } from "express";
import config from "config";
import { CookieConfig } from "../../../types/config.types";

const cookieConfig = config.get<CookieConfig>("cookie");

export const assignTokens = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res
    .cookie("accessToken", accessToken, {
      domain: cookieConfig.domain,
      httpOnly: cookieConfig.httpOnly,
      sameSite: cookieConfig.sameSite,
      secure: cookieConfig.secure,
      maxAge: cookieConfig.maxAge.accessToken,
    })
    .cookie("refreshToken", refreshToken, {
      domain: cookieConfig.domain,
      httpOnly: cookieConfig.httpOnly,
      sameSite: cookieConfig.sameSite,
      secure: cookieConfig.secure,
      maxAge: cookieConfig.maxAge.refreshToken,
    });

  return res;
};
