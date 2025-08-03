import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api-error";
import { Role } from "../../modules/user/user.types";

export function requireRole(requiredRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      return next(new ApiError("Authentication required", 401));
    }

    if (user.role !== requiredRole) {
      return next(new ApiError("Access denied: insufficient permissions", 403));
    }

    next();
  };
}
