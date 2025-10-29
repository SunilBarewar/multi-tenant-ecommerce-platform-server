import type { RequestHandler } from "express";

export function createRequestHandler(controller: any): RequestHandler {
  if (typeof controller !== "function") {
    throw new Error("Controller must be a function");
  }

  return (req, res, next) => {
    controller(req, res, next);
  };
}
