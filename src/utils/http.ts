import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, "Route not found"));
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      details: error.flatten()
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}
