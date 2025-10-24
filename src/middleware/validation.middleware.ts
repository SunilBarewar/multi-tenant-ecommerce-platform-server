import type { NextFunction, Request, RequestHandler, Response } from "express";

import z from "zod";

import type { ValidationSchemas } from "@/shared/types/request.types";

export function validate(schemas: ValidationSchemas): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and replace params
      if (schemas.params) {
        req.params = (await schemas.params.parseAsync(
          req.params,
        )) as Request["params"];
      }

      // Validate and replace query (with defaults)
      if (schemas.query) {
        req.query = (await schemas.query.parseAsync(
          req.query,
        )) as Request["query"];
      }

      // Validate and replace body
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}
