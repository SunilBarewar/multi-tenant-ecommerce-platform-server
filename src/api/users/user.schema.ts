import { z } from "zod";

import { USER_ROLES } from "@/shared/enums/user-roles.enum";

export const CreateUserBodySchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(USER_ROLES).optional(),
});

export const UpdateUserSchema = z.object({
  email: z.email("Invalid email address").optional(),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
});

export const UserIdSchema = z.object({
  id: z.cuid("Invalid user ID"),
});

export const UserQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.coerce.boolean().optional(),
});

export const CreateUserValidation = {
  body: CreateUserBodySchema,
} as const;

export const DeleteUserValidation = {
  params: z.object({
    id: z.cuid("Invalid user ID"),
  }),
} as const;

export const GetAllUsersValidation = {
  query: UserQuerySchema,
} as const;

export const GetUserByValidation = {
  params: UserIdSchema,
} as const;

export const UpdateUserValidation = {
  params: UserIdSchema,
  body: UpdateUserSchema,
} as const;
