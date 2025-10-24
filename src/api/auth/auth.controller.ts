import { type NextFunction, type Request, type Response } from "express";

import { MESSAGES } from "../../../shared/constants/messages";
import { HTTP_STATUS } from "../../../shared/constants/status-codes";
import { ResponseFormatter } from "../../../utils/formatters/response.formatter";
import { createTypesafeHandler } from "../../../utils/validation/typesafe-handler";
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController {
  login = createTypesafeHandler(
    { body: LoginSchema },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.authService.login(req.body);

        return ResponseFormatter.success(res, MESSAGES.LOGIN_SUCCESS, result);
      } catch (error) {
        next(error);
      }
    },
  );

  logout = createTypesafeHandler(
    { body: RefreshTokenSchema },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.authService.logout(req.body.refreshToken);

        return ResponseFormatter.success(res, MESSAGES.LOGOUT_SUCCESS);
      } catch (error) {
        next(error);
      }
    },
  );

  refreshToken = createTypesafeHandler(
    { body: RefreshTokenSchema },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.authService.refreshToken(
          req.body.refreshToken,
        );

        return ResponseFormatter.success(res, MESSAGES.TOKEN_REFRESHED, result);
      } catch (error) {
        next(error);
      }
    },
  );

  register = createTypesafeHandler(
    { body: RegisterSchema },
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await this.authService.register(req.body);

        return ResponseFormatter.success(
          res,
          MESSAGES.REGISTER_SUCCESS,
          result,
          HTTP_STATUS.CREATED,
        );
      } catch (error) {
        next(error);
      }
    },
  );

  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
}
