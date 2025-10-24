import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";

import { UserController } from "./user.controller";

export function createUserRoutes(): Router {
  const router = Router();
  const controller = new UserController();

  // Public routes
  router.post("/", controller.createUser);

  // Protected routes
  router.get("/profile", authMiddleware, controller.getProfile);
  router.get("/", authMiddleware, controller.getAllUsers);
  router.get("/:id", authMiddleware, controller.getUserById);
  router.patch("/:id", authMiddleware, controller.updateUser);
  router.delete("/:id", authMiddleware, controller.deleteUser);

  return router;
}
