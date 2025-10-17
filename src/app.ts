import type { Application, Request, Response } from "express";

import express from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express 🚀");
});

export default app;
