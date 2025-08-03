import { Request, Response, NextFunction } from "express";
import { RegisterUserDto } from "./dto/register.dto";
import { createUser } from "../user/user.service";
import { LoginUserDto } from "./dto/login.dto";
import { loginUser } from "./auth.service";
import { assignTokens } from "./helpers/assignTokens.helper";

export const registerController = async (
  req: Request<{}, {}, RegisterUserDto>,
  res: Response,
  next: NextFunction
) => {
  const userData = req.body;

  const { accessToken, refreshToken, user } = await createUser(userData);

  res = assignTokens(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { accessToken, refreshToken, user },
  });
};

export const loginController = async (
  req: Request<{}, {}, LoginUserDto>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken, user } = await loginUser({
    email,
    password,
  });

  res = assignTokens(res, accessToken, refreshToken);

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { accessToken, refreshToken, user },
  });
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};
