import type z from "zod";

import type {
  CreateUserBodySchema,
  UpdateUserSchema,
  UserQuerySchema,
} from "@/modules/users/user.schema";
import type { User as PrismaUser } from "@/generated/prisma";

export type CreateUserDTO = z.infer<typeof CreateUserBodySchema>;

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export type User = PrismaUser;

export type UserQueryParams = z.infer<typeof UserQuerySchema>;

export type UserWithoutPassword = Omit<User, "password">;
