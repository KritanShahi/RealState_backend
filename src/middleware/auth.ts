import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/http";

type JwtPayload = {
  userId: string;
  role: "buyer" | "admin";
};

export function authRequired(req: Request, _res: Response, next: NextFunction): void {
  const bearer = req.header("authorization");
  const tokenFromHeader = bearer?.startsWith("Bearer ") ? bearer.slice(7) : undefined;
  const token = req.cookies?.token ?? tokenFromHeader;

  if (!token) {
    next(new ApiError(401, "Unauthorized"));
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = {
      userId: payload.userId,
      role: payload.role
    };
    next();
  } catch (_error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
