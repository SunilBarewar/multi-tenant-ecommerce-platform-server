import { Router } from "express";
import { validate } from "zod-express-validator";

import { UserController } from "@/modules/users/user.controller";
import {
  CreateUserValidationSchemas,
  DeleteUserValidationSchemas,
  GetAllUsersValidationSchemas,
  GetUserByValidationSchemas,
  UpdateUserValidationSchemas,
} from "@/modules/users/user.schema";
import { UserService } from "@/modules/users/user.service";
import { authMiddleware } from "@/middleware";

export function createUserRoutes(): Router {
  const router = Router();
  const userService = new UserService();
  const controller = new UserController(userService);

  router.post(
    "/",
    authMiddleware,
    validate(CreateUserValidationSchemas),
    controller.createUser,
  );

  router.post("/profile", authMiddleware, controller.getProfile);

  router.get(
    "/",
    authMiddleware,
    validate(GetAllUsersValidationSchemas),
    controller.getAllUsers,
  );

  router.get(
    "/:id",
    authMiddleware,
    validate(GetUserByValidationSchemas),
    controller.getUserById,
  );

  router.patch(
    "/:id",
    authMiddleware,
    validate(UpdateUserValidationSchemas),
    controller.updateUser,
  );

  router.delete(
    "/:id",
    authMiddleware,
    validate(DeleteUserValidationSchemas),
    controller.deleteUser,
  );

  return router;
}
