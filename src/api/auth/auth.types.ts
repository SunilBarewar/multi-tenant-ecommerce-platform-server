import { UserWithoutPassword } from "../users/user.types";

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
