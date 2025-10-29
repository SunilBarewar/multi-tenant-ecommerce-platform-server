import { Router } from "express";
// import validate from "express-zod-safe";
import z from "zod";
import { validate } from "zod-express-validator";

// import { validate } from "@/middleware";
import { authMiddleware } from "@/middleware/auth.middleware";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

const bodySchema = z.object({
  name: z.string().min(3).max(255),
});

const paramsSchema = z.object({
  userId: z.coerce.number(),
});

const querySchema = z.object({
  page: z.coerce.number().min(1).max(100),
});

// const responseSchema = z.object({
//   success: z.boolean(),
// });

// const authenticate: WeakRequestHandler = (req, res, next) => {
//   // ... perform user authentication
//   req.user = { id: "1", email: "1", role: "1" }; // Example user
//   req.user = { id: "1", email: "1", role: "1" }; // Example user
//   next();
// };

export function createUserRoutes(): Router {
  const router = Router();
  const userService = new UserService();
  const controller = new UserController(userService);

  // Public routes
  router.post(
    "/",

    validate({
      body: bodySchema,
      params: paramsSchema,
      query: querySchema,
    }),
    controller.createUser,
  );

  // Protected routes
  router.post("/profile", authMiddleware, validate({ query: querySchema }));

  router.get(
    "/",
    authMiddleware,
    validate({ query: querySchema }),
    controller.getAllUsers,
  );

  router.get("/:id", authMiddleware, controller.getUserById);
  router.patch("/:id", authMiddleware, controller.updateUser);
  router.delete("/:id", authMiddleware, controller.deleteUser);

  return router;
}
