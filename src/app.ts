import type { Application, Request, Response } from "express";

import express from "express";

import { errorMiddleware, loggingMiddleware } from "@/middleware";

const app: Application = express();

app.use(express.json());

app.use(loggingMiddleware);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express 🚀");
});

app.use(errorMiddleware);

export default app;
