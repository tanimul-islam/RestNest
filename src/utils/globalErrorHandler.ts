import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import { ZodError } from "zod";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = "Something went wrong";
  let errorDetails: unknown = {
    path: req.originalUrl,
    method: req.method,
  };
  if (error instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation failed";

    errorDetails = error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorDetails = error.errorDetails ?? {
      path: req.originalUrl,
      method: req.method,
    };
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
