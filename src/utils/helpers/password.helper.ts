import bcrypt from "bcryptjs";
import crypto from "crypto";

export class PasswordHelper {
  private static readonly SALT_ROUNDS = 10;

  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static generateOtp(length: number = 6): string {
    const digits = "0123456789";
    let otp = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);

      otp += digits[randomIndex];
    }

    return otp;
  }

  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }

  static validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
