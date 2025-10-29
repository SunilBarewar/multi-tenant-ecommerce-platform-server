// types/request-typed.ts
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { z } from "zod";

/**
 * Inferred authenticated request: same as InferredRequest but with non-nullable user
 */
export type InferredAuthenticatedRequest<S extends ValidationSchemas> =
  InferredRequest<S> & { user: NonNullable<Request["user"]> };

/**
 * Inferred (typed) Request that matches the validate() middleware generics:
 * Request<Params, ResBody, ReqBody, ReqQuery>
 *
 * - params  <- inferred from schemas.params
 * - res body <- inferred from schemas.res (used on Response<T>)
 * - body    <- inferred from schemas.body
 * - query   <- inferred from schemas.query
 */
export type InferredRequest<S extends ValidationSchemas> = Request<
  InferFromSchema<S, "params">,
  InferFromSchema<S, "res">,
  InferFromSchema<S, "body">,
  InferFromSchema<S, "query">
>;

/**
 * Controller type for authenticated routes (req.user guaranteed non-null)
 */
export type TypedAuthenticatedController<S extends ValidationSchemas> = (
  req: InferredAuthenticatedRequest<S>,
  res: Response<InferFromSchema<S, "res">>,
  next: NextFunction,
) => any;

/**
 * Controller type for non-authenticated routes.
 *
 * - req is typed according to the schema S
 * - res is Response< ResSchemaOutput >
 * - next is the usual NextFunction
 *
 * Returns `any` or `Promise<any>` (adjust if you want stricter return types)
 */
export type TypedController<S extends ValidationSchemas> = (
  req: InferredRequest<S>,
  res: Response<InferFromSchema<S, "res">>,
  next: NextFunction,
) => any;

export type UnvalidatedRequestHandler = RequestHandler<
  Unvalidated,
  Unvalidated,
  Unvalidated,
  Unvalidated
>;

/**
 * Generic ValidationSchemas shape (same concept as your earlier definitions)
 */
export type ValidationSchemas = {
  params?: z.ZodSchema;
  query?: z.ZodSchema;
  body?: z.ZodSchema;
  res?: z.ZodSchema;
};

/**
 * Helper: infer the output type from a Zod schema if present, otherwise `unknown`.
 * Using `z.ZodSchema` + `z.infer<>` keeps inference accurate.
 */
type InferFromSchema<
  S extends ValidationSchemas,
  K extends keyof ValidationSchemas,
> = S[K] extends z.ZodSchema ? z.infer<S[K]> : unknown;

type Unvalidated = unknown;
