import { AuthRepository } from "@/modules/auth/auth.repository";
import { type LoginDTO, type RegisterDTO } from "@/modules/auth/auth.types";
import { ConflictError, UnauthorizedError } from "@/errors";
import { JwtHelper } from "@/utils/helpers";
import { PasswordHelper } from "@/utils/helpers/password.helper";

export class AuthService {
  private readonly repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.repository.findUserByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await PasswordHelper.hash(data.password);

    const user = await this.repository.createUser({
      email: data.email,
      password: hashedPassword,
      name: data.name,
    });

    const token = JwtHelper.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(data: LoginDTO) {
    const user = await this.repository.findUserByEmail(data.email);

    if (!user?.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await PasswordHelper.compare(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    await this.repository.updateLastLogin(user.id);

    const token = JwtHelper.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };

    // const tokens = this.jwtUtils.generateTokenPair(user.id, user.email);

    // await this.repository.createRefreshToken(
    //   user.id,
    //   tokens.refreshToken,
    //   this.jwtUtils.getRefreshTokenExpiry(),
    // );

    // return {
    //   ...tokens,
    //   user: this.mapUserToAuthUser(user),
    // };
  }

  // async requestOtp(data: RequestOtpInput): Promise<void> {
  //   const user = await this.repository.findUserByEmail(data.email);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   if (!user.isActive) {
  //     throw new UnauthorizedError("Account is deactivated");
  //   }

  //   const otp = PasswordUtils.generateOtp(6);
  //   const expiresAt = new Date(
  //     Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || "10") * 60 * 1000,
  //   );

  //   await this.repository.createOtpCode(user.id, otp, expiresAt);
  //   await this.emailService.sendOtpEmail(user.email, otp);
  // }

  // async verifyOtp(data: VerifyOtpInput): Promise<LoginResponse> {
  //   const user = await this.repository.findUserByEmail(data.email);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   const otpRecord = await this.repository.findValidOtpCode(
  //     user.id,
  //     data.code,
  //   );

  //   if (!otpRecord) {
  //     throw new UnauthorizedError("Invalid or expired OTP");
  //   }

  //   const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || "3");

  //   if (otpRecord.attempts >= maxAttempts) {
  //     throw new UnauthorizedError("Maximum OTP attempts exceeded");
  //   }

  //   if (otpRecord.code !== data.code) {
  //     await this.repository.incrementOtpAttempts(otpRecord.id);
  //     throw new UnauthorizedError("Invalid OTP");
  //   }

  //   await this.repository.markOtpAsUsed(otpRecord.id);
  //   await this.repository.updateLastLogin(user.id);

  //   const tokens = this.jwtUtils.generateTokenPair(user.id, user.email);

  //   await this.repository.createRefreshToken(
  //     user.id,
  //     tokens.refreshToken,
  //     this.jwtUtils.getRefreshTokenExpiry(),
  //   );

  //   return {
  //     ...tokens,
  //     user: this.mapUserToAuthUser(user),
  //   };
  // }

  // async requestMagicLink(data: RequestMagicLinkInput): Promise<void> {
  //   const user = await this.repository.findUserByEmail(data.email);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   if (!user.isActive) {
  //     throw new UnauthorizedError("Account is deactivated");
  //   }

  //   const token = PasswordHelper.generateSecureToken(32);
  //   const expiresAt = new Date(
  //     Date.now() +
  //       parseInt(process.env.MAGIC_LINK_EXPIRY_MINUTES || "15") * 60 * 1000,
  //   );

  //   await this.repository.createMagicLink(user.id, token, expiresAt);

  //   const magicLink = `${process.env.FRONTEND_URL}/auth/magic-link?token=${token}`;

  //   await this.emailService.sendMagicLink(user.email, magicLink);
  // }

  // async verifyMagicLink(data: VerifyMagicLinkInput): Promise<LoginResponse> {
  //   const magicLink = await this.repository.findValidMagicLink(data.token);

  //   if (!magicLink) {
  //     throw new UnauthorizedError("Invalid or expired magic link");
  //   }

  //   const { user } = magicLink;

  //   if (!user.isActive) {
  //     throw new UnauthorizedError("Account is deactivated");
  //   }

  //   await this.repository.markMagicLinkAsUsed(magicLink.id);
  //   await this.repository.updateLastLogin(user.id);

  //   const tokens = this.jwtUtils.generateTokenPair(user.id, user.email);

  //   await this.repository.createRefreshToken(
  //     user.id,
  //     tokens.refreshToken,
  //     this.jwtUtils.getRefreshTokenExpiry(),
  //   );

  //   return {
  //     ...tokens,
  //     user: this.mapUserToAuthUser(user),
  //   };
  // }

  // async refreshToken(data: RefreshTokenInput): Promise<AuthTokens> {
  //   const refreshToken = await this.repository.findValidRefreshToken(
  //     data.refreshToken,
  //   );

  //   if (!refreshToken) {
  //     throw new UnauthorizedError("Invalid or expired refresh token");
  //   }

  //   const { user } = refreshToken;

  //   if (!user.isActive) {
  //     throw new UnauthorizedError("Account is deactivated");
  //   }

  //   await this.repository.revokeRefreshToken(data.refreshToken);

  //   const tokens = JwtHelper.generateTokenPair({
  //     userId: user.id,
  //     email: user.email,
  //     role: user.role,
  //   });

  //   await this.repository.createRefreshToken(
  //     user.id,
  //     tokens.refreshToken,
  //     this.jwtUtils.getRefreshTokenExpiry(),
  //   );

  //   return tokens;
  // }

  async logout(refreshToken: string): Promise<void> {
    await this.repository.revokeRefreshToken(refreshToken);
  }

  // async logoutAll(userId: string): Promise<void> {
  //   await this.repository.revokeAllUserRefreshTokens(userId);
  //   await this.repository.deleteAllUserSessions(userId);
  // }

  // async getCurrentUser(userId: string): Promise<AuthUser> {
  //   const user = await this.repository.findUserById(userId);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   return this.mapUserToAuthUser(user);
  // }

  // private mapUserToAuthUser(user: any): AuthUser {
  //   return {
  //     id: user.id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     isEmailVerified: user.isEmailVerified,
  //     profilePicture: user.profilePicture,
  //     phoneNumber: user.phoneNumber,
  //     bio: user.bio,
  //   };
  // }

  // async cleanupExpiredTokens(): Promise<void> {
  //   await this.repository.deleteExpiredOtpCodes();
  //   await this.repository.deleteExpiredMagicLinks();
  //   await this.repository.deleteExpiredRefreshTokens();
  //   await this.repository.deleteExpiredSessions();
  //   await this.repository.deleteExpiredPasswordResetTokens();
  //   await this.repository.deleteExpiredEmailVerificationTokens();
  // }

  // // Email Verification Methods
  // async sendEmailVerification(
  //   userId: string,
  //   method: "magic_link" | "otp",
  // ): Promise<void> {
  //   const user = await this.repository.findUserById(userId);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   if (user.isEmailVerified) {
  //     throw new BadRequestError("Email is already verified");
  //   }

  //   // Revoke all previous verification tokens
  //   await this.repository.revokeAllEmailVerificationTokens(userId);

  //   const token = PasswordHelper.generateSecureToken(32);
  //   const expiresAt = new Date(
  //     Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES || "10") * 60 * 1000,
  //   );

  //   if (method === "otp") {
  //     const otp = PasswordHelper.generateOtp(6);

  //     await this.repository.createEmailVerificationToken(
  //       userId,
  //       token,
  //       "OTP",
  //       expiresAt,
  //       otp,
  //     );
  //     await this.emailService.sendEmailVerificationOtp(user.email, otp);
  //   } else {
  //     await this.repository.createEmailVerificationToken(
  //       userId,
  //       token,
  //       "MAGIC_LINK",
  //       expiresAt,
  //     );
  //     const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

  //     await this.emailService.sendEmailVerificationMagicLink(
  //       user.email,
  //       verificationLink,
  //     );
  //   }
  // }

  // async verifyEmailWithOtp(userId: string, code: string): Promise<void> {
  //   const user = await this.repository.findUserById(userId);

  //   if (!user) {
  //     throw new NotFoundError("User not found");
  //   }

  //   if (user.isEmailVerified) {
  //     throw new BadRequestError("Email is already verified");
  //   }

  //   const verificationToken =
  //     await this.repository.findValidEmailVerificationByCode(userId, code);

  //   if (!verificationToken) {
  //     throw new UnauthorizedError("Invalid or expired verification code");
  //   }

  //   const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || "3");

  //   if (verificationToken.attempts >= maxAttempts) {
  //     throw new UnauthorizedError("Maximum verification attempts exceeded");
  //   }

  //   if (verificationToken.code !== code) {
  //     await this.repository.incrementEmailVerificationAttempts(
  //       verificationToken.id,
  //     );
  //     throw new UnauthorizedError("Invalid verification code");
  //   }

  //   await this.repository.markEmailVerificationTokenAsUsed(
  //     verificationToken.id,
  //   );
  //   await this.repository.updateUser(userId, {
  //     isEmailVerified: true,
  //     emailVerifiedAt: new Date(),
  //   });

  //   // Send welcome email after verification
  //   await this.emailService.sendWelcomeEmail(
  //     user.email,
  //     user.firstName ?? undefined,
  //   );
  // }

  // async verifyEmailWithMagicLink(token: string): Promise<void> {
  //   const verificationToken =
  //     await this.repository.findValidEmailVerificationToken(token);

  //   if (!verificationToken) {
  //     throw new UnauthorizedError("Invalid or expired verification link");
  //   }

  //   const { user } = verificationToken;

  //   if (user.isEmailVerified) {
  //     throw new BadRequestError("Email is already verified");
  //   }

  //   await this.repository.markEmailVerificationTokenAsUsed(
  //     verificationToken.id,
  //   );
  //   await this.repository.updateUser(user.id, {
  //     isEmailVerified: true,
  //     emailVerifiedAt: new Date(),
  //   });

  //   // Send welcome email after verification
  //   await this.emailService.sendWelcomeEmail(
  //     user.email,
  //     user.firstName || undefined,
  //   );
  // }

  // async requestPasswordReset(email: string): Promise<void> {
  //   const user = await this.repository.findUserByEmail(email);

  //   if (!user) {
  //     // Don't reveal if user exists for security
  //     return;
  //   }

  //   if (!user.isActive) {
  //     return;
  //   }

  //   // Revoke any existing password reset tokens for this user
  //   await this.repository.revokeAllPasswordResetTokens(user.id);

  //   const token = PasswordHelper.generateSecureToken(32);
  //   const expiryHours = parseInt(
  //     process.env.PASSWORD_RESET_EXPIRY_HOURS || "1",
  //   );
  //   const expiresAt = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

  //   await this.repository.createPasswordResetToken(user.id, token, expiresAt);

  //   const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  //   await this.emailService.sendPasswordResetEmail(user.email, resetLink);
  // }

  // async resetPassword(token: string, newPassword: string): Promise<void> {
  //   const resetToken = await this.repository.findValidPasswordResetToken(token);

  //   if (!resetToken) {
  //     throw new UnauthorizedError("Invalid or expired password reset token");
  //   }

  //   const { user } = resetToken;

  //   if (!user.isActive) {
  //     throw new UnauthorizedError("Account is deactivated");
  //   }

  //   const hashedPassword = await PasswordHelper.hash(newPassword);

  //   await this.repository.updateUser(user.id, { password: hashedPassword });
  //   await this.repository.markPasswordResetTokenAsUsed(resetToken.id);

  //   // Revoke all refresh tokens for security
  //   await this.repository.revokeAllUserRefreshTokens(user.id);
  //   await this.repository.deleteAllUserSessions(user.id);
  // }

  // async changePassword(
  //   userId: string,
  //   currentPassword: string,
  //   newPassword: string,
  // ): Promise<void> {
  //   const user = await this.repository.findUserById(userId);

  //   if (!user?.password) {
  //     throw new BadRequestError("Cannot change password for this account");
  //   }

  //   const isPasswordValid = await PasswordHelper.compare(
  //     currentPassword,
  //     user.password,
  //   );

  //   if (!isPasswordValid) {
  //     throw new UnauthorizedError("Current password is incorrect");
  //   }

  //   const hashedPassword = await PasswordHelper.hash(newPassword);

  //   await this.repository.updateUser(userId, { password: hashedPassword });

  //   // Revoke all refresh tokens except current one for security
  //   await this.repository.revokeAllUserRefreshTokens(userId);
  // }
}
