import type z from "zod";

import type {
  LoginSchema,
  RegisterSchema,
} from "@/modules/auth/auth.validation";

import { type UserWithoutPassword } from "@/modules/users/user.types";

export interface AuthResponse {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type LoginDTO = z.infer<typeof LoginSchema>;

export interface RefreshTokenDTO {
  refreshToken: string;
}

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
