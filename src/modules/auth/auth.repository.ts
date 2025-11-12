import {
  type MagicLink,
  type OtpCode,
  type Prisma,
  type RefreshToken,
  type Session,
  type User,
} from "@/generated/prisma";
import { BaseRepository } from "@/utils/db/base.repository";

export class AuthRepository extends BaseRepository {
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findUserByEmail(email: string): Promise<null | User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUser(condition: Prisma.UserWhereUniqueInput): Promise<null | User> {
    return this.prisma.user.findUnique({ where: condition });
  }

  async findUserById(id: string): Promise<null | User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  // OTP operations
  async createOtpCode(
    userId: string,
    code: string,
    expiresAt: Date,
  ): Promise<OtpCode> {
    return this.prisma.otpCode.create({
      data: { userId, code, expiresAt },
    });
  }

  async findValidOtpCode(userId: string, code: string) {
    return this.prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markOtpAsUsed(id: string): Promise<void> {
    await this.prisma.otpCode.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await this.prisma.otpCode.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async deleteExpiredOtpCodes(): Promise<void> {
    await this.prisma.otpCode.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  // Magic Link operations
  async createMagicLink(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<MagicLink> {
    return this.prisma.magicLink.create({
      data: { userId, token, expiresAt },
    });
  }

  async findValidMagicLink(token: string) {
    return this.prisma.magicLink.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async markMagicLinkAsUsed(id: string): Promise<void> {
    await this.prisma.magicLink.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async deleteExpiredMagicLinks(): Promise<void> {
    await this.prisma.magicLink.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  // Refresh Token operations
  async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findValidRefreshToken(token: string) {
    return this.prisma.refreshToken.findFirst({
      where: {
        token,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }

  async deleteExpiredRefreshTokens(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  // Session operations
  async createSession(data: {
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async findValidSession(token: string): Promise<null | Session> {
    return this.prisma.session.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async deleteSession(token: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { token } });
  }

  async deleteAllUserSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  // Password Reset Token operations
  async createPasswordResetToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<any> {
    return this.prisma.passwordResetToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findValidPasswordResetToken(token: string): Promise<any> {
    return this.prisma.passwordResetToken.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async markPasswordResetTokenAsUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await this.prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  async revokeAllPasswordResetTokens(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: { userId, isUsed: false },
      data: { isUsed: true },
    });
  }

  // Email Verification Token operations
  async createEmailVerificationToken(
    userId: string,
    token: string,
    type: string,
    expiresAt: Date,
    code?: string,
  ): Promise<any> {
    return this.prisma.emailVerificationToken.create({
      data: { userId, token, type, expiresAt, code },
    });
  }

  async findValidEmailVerificationToken(token: string): Promise<any> {
    return this.prisma.emailVerificationToken.findFirst({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async findValidEmailVerificationByCode(
    userId: string,
    code: string,
  ): Promise<any> {
    return this.prisma.emailVerificationToken.findFirst({
      where: {
        userId,
        code,
        type: "OTP",
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markEmailVerificationTokenAsUsed(id: string): Promise<void> {
    await this.prisma.emailVerificationToken.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async incrementEmailVerificationAttempts(id: string): Promise<void> {
    await this.prisma.emailVerificationToken.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async deleteExpiredEmailVerificationTokens(): Promise<void> {
    await this.prisma.emailVerificationToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  async revokeAllEmailVerificationTokens(userId: string): Promise<void> {
    await this.prisma.emailVerificationToken.updateMany({
      where: { userId, isUsed: false },
      data: { isUsed: true },
    });
  }
}
