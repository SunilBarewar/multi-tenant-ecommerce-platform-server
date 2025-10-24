/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextFunction, type Request, type Response } from "express";
import { type z, type ZodType } from "zod";

// Inferred Authenticated Request type with user property
export type InferredAuthenticatedRequest<T extends ValidationSchemas> =
  InferredRequest<T> & {
    user: NonNullable<Request["user"]>;
  };

// Inferred Request type that extends Express Request properly
export type InferredRequest<T extends ValidationSchemas> = Request<
  T["params"] extends ZodType ? z.infer<T["params"]> : any,
  any,
  T["body"] extends ZodType ? z.infer<T["body"]> : any,
  T["query"] extends ZodType ? z.infer<T["query"]> : any
>;

export type TypedAuthenticatedController<T extends ValidationSchemas> = (
  req: InferredAuthenticatedRequest<T>,
  res: Response,
  next: NextFunction,
) => any;

// Controller type that's compatible with Express RequestHandler
export type TypedController<T extends ValidationSchemas> = (
  req: InferredRequest<T>,
  res: Response,
  next: NextFunction,
) => any;

export interface ValidationSchemas {
  params?: ZodType;
  query?: ZodType;
  body?: ZodType;
}
