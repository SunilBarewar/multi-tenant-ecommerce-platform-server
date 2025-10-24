import { type NextFunction, type Request, type Response } from "express";

import { UnauthorizedException } from "@/exceptions";
import { JwtHelper } from "@/utils/helpers/jwt.helper";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.substring(7);
    const payload = JwtHelper.verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}
