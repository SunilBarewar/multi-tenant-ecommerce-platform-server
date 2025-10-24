import type { Application, Request, Response } from "express";

import express from "express";

import { errorMiddleware } from "./middleware/error.middleware";
import { loggingMiddleware } from "./middleware/logging.middleware";

const app: Application = express();

app.use(express.json());

app.use(loggingMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express 🚀");
});

app.use(errorMiddleware);

export default app;
