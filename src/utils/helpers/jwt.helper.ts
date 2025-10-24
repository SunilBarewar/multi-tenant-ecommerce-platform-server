import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "@/config/env";
import { InvalidTokenException, TokenExpiredException } from "@/exceptions";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtHelper {
  static decode(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }

  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: (env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "1d",
    });
  }

  static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn:
        (env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d",
    });
  }

  static verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException();
      }
      throw new InvalidTokenException();
    }
  }

  static verifyRefreshToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new TokenExpiredException();
      }
      throw new InvalidTokenException();
    }
  }
}
