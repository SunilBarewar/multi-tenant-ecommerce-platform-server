import dotenv from "dotenv";
import { z } from "zod";

import { ENV } from "@/shared/enums";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(ENV).default(ENV.DEVELOPMENT),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.url(),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),

  // CORS
  ALLOWED_ORIGINS: z.string().transform((val) => val.split(",")),

  // Logging and Monitoring
  LOG_LEVEL: z.string().default("info"),
  HYPERDX_API_KEY: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    process.exit(1);
  }
}

export const env = validateEnv();
