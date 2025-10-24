export const SUCCESS_MESSAGES = {
  // Auth messages
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTER_SUCCESS: "Registration successful",
  TOKEN_REFRESHED: "Token refreshed successfully",

  // User messages
  USER_CREATED: "User created successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_FETCHED: "User fetched successfully",
} as const;

export const ERROR_MESSAGES = {
  // Auth errors
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User with this email already exists",

  UNAUTHORIZED: "Unauthorized access",

  FORBIDDEN: "You do not have permission to perform this action",

  VALIDATION_ERROR: "Validation failed",

  INTERNAL_SERVER_ERROR: "Internal server error",
} as const;
