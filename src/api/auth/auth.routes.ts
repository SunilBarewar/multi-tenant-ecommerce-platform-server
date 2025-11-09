import { Router } from "express";

import { AuthController } from "./auth.controller";

export function createAuthRoutes(): Router {
  const router = Router();
  const controller = new AuthController();

  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.post("/refresh", controller.refreshToken);
  router.post("/logout", controller.logout);

  return router;
}
