import { UserRepository } from "../users/user.repository";
import {
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  TokenResponse,
} from "./auth.types";
import { PasswordHelper } from "../../../utils/helpers/password.helper";
import { JwtHelper } from "../../../utils/helpers/jwt.helper";
import {
  InvalidCredentialsException,
  ConflictException,
  NotFoundException,
} from "../../../exceptions";
import { MESSAGES } from "../../../shared/constants/messages";
import { prisma } from "../../../core/database/client";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await PasswordHelper.hash(data.password);

    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new InvalidCredentialsException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new InvalidCredentialsException("Account is inactive");
    }

    // Verify password
    const isPasswordValid = await PasswordHelper.compare(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException(MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.email,
      user.role,
    );

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(oldRefreshToken: string): Promise<TokenResponse> {
    // Verify refresh token
    const payload = JwtHelper.verifyRefreshToken(oldRefreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
    });

    if (!storedToken) {
      throw new InvalidCredentialsException("Invalid refresh token");
    }

    // Check if token is expired
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new InvalidCredentialsException("Refresh token expired");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      payload.userId,
      payload.email,
      payload.role,
    );

    // Delete old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Store new refresh token
    await this.storeRefreshToken(payload.userId, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { userId, email, role };
    const accessToken = JwtHelper.generateAccessToken(payload);
    const refreshToken = JwtHelper.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private async storeRefreshToken(
    userId: string,
    token: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}
