import type { TypedController } from "@/shared/types/request.types";

import { HTTP_STATUS, SUCCESS_MESSAGES } from "@/shared/constants";
import { ResponseFormatter } from "@/utils/formatters/response.formatter";

import {
  type CreateUserValidation,
  type DeleteUserValidation,
  type GetAllUsersValidation,
  type GetUserByValidation,
  type UpdateUserValidation,
} from "./user.schema";
import { type UserService } from "./user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  createUser: TypedController<typeof CreateUserValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      const user = await this.userService.createUser(req.body);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.USER_CREATED,
        data: user,
        statusCode: HTTP_STATUS.CREATED,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser: TypedController<typeof DeleteUserValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      await this.userService.deleteUser(req.params.id);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.USER_DELETED,
        data: null,
        statusCode: HTTP_STATUS.NO_CONTENT,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers: TypedController<typeof GetAllUsersValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      const { users, total } = await this.userService.getAllUsers(req.query);
      const { page, limit } = req.query;

      return ResponseFormatter.paginated(res, {
        message: SUCCESS_MESSAGES.USER_FETCHED,
        data: users,
        page,
        limit,
        totalItems: total,
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById: TypedController<typeof GetUserByValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      const user = await this.userService.getUserById(req.params.id);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.USER_FETCHED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser: TypedController<typeof UpdateUserValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.USER_UPDATED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile: TypedController<typeof GetUserByValidation> = async (
    req,
    res,
    next,
  ) => {
    try {
      const user = await this.userService.getUserById(req.user.id);

      return ResponseFormatter.success(res, {
        message: SUCCESS_MESSAGES.USER_FETCHED,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
