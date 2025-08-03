import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ApiError } from "../errors/api-error";

export const validateRequest =
  (schema: z.ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      });

      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const formattedErrors = err.issues.map((issue) => {
          const path = issue.path.join(".");
          return `${issue.message}`;
        });

        return next(new ApiError(formattedErrors.join(", "), 400));
      }

      next(err);
    }
  };
