import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error";

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    return next(new ApiError("Authentication required", 401));
  }

  next();
}
