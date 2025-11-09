import type { Request } from "express";

import { UnauthorizedException } from "@/errors";

/**
 * Asserts that an authenticated user exists on the request object.
 *
 * ✅ Purpose:
 *  - Ensures `req.user` is defined at runtime (throws if missing).
 *  - Narrows the type of `req` for TypeScript, so `req.user` becomes non-nullable
 *    after this call — removing the need for repetitive `if (req.user)` checks.
 *
 * 🧠 When to use:
 *  - Inside controllers or middleware that are only reachable by authenticated users.
 *  - When TypeScript marks `req.user` as optional, but you *know* it always exists.
 *
 * ⚠️ Behavior:
 *  - If `req.user` is undefined or null, it throws an error.
 *  - Otherwise, TypeScript infers `req.user` as `NonNullable<R["user"]>` for the rest of the scope.
 *
 * Example:
 * ```ts
 * assertUser(req);
 * console.log(req.user.id); // ✅ fully typed and non-null
 * ```
 *
 * @throws {Error} if `req.user` is missing (should not happen for authenticated routes).
 */

export function assertUser<
  R extends Request<any, any, any, any, any> & { user?: unknown },
>(req: R): asserts req is R & { user: NonNullable<R["user"]> } {
  if (!req.user) {
    throw new UnauthorizedException("User not found", {
      info: "req.user is undefined",
    });
  }
}
