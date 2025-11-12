import type { TypedController } from "@/shared/types";

import { AuthService } from "@/modules/auth/auth.service";
import {
  type LoginValidationSchemas,
  type RegisterValidationSchemas,
} from "@/modules/auth/auth.validation";
import { SUCCESS_MESSAGES } from "@/shared/constants";
import { HTTP_STATUS } from "@/shared/constants";
import { ResponseFormatter } from "@/utils/formatters/response.formatter";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login: TypedController<typeof LoginValidationSchemas> = async (
    req,
    res,
    next,
  ) => {
    try {
      const result = await this.authService.login(req.body);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        data: result,
        statusCode: HTTP_STATUS.OK,
      });
    } catch (error) {
      next(error);
    }
  };

  register: TypedController<typeof RegisterValidationSchemas> = async (
    req,
    res,
    next,
  ) => {
    try {
      const result = await this.authService.register(req.body);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        data: result,
        statusCode: HTTP_STATUS.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };
}
