import { Request, Response, NextFunction } from "express";
import { ApiError } from "./api-error";
import logger from "../logger/logger";

const handleDuplicateFieldDb = (err: any) => {
  const duplicateKey = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateKey];
  const message = `The value '${duplicateValue}' for the field '${duplicateKey}' is already used.`;
  return new ApiError(message, 400);
};

const handleCastErrorDb = (err: any) => {
  const message = `Invalid value for '${err.path}': '${err.value}'`;
  return new ApiError(message, 400);
};

const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = errors.join(", ");
  return new ApiError(message, 400);
};

const sendErrorDev = (err: ApiError, res: Response) => {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ApiError, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  logger.error("Unhandled Error ", err);

  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong",
  });
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode ||= 500;
  err.status ||= "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    if (err.name === "CastError") err = handleCastErrorDb(err);
    if (err.code === 11000) err = handleDuplicateFieldDb(err);
    if (err.name === "ValidationError") err = handleValidationError(err);

    sendErrorProd(err, res);
  }
};
