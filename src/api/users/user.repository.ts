import { BaseRepository } from "@/utils/db/base.repository";

import type {
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserQueryParams,
} from "./user.types";

export class UserRepository extends BaseRepository<User> {
  async findById(id: string): Promise<null | User> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<null | User> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll(
    params: UserQueryParams,
  ): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, search, role, isActive } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { id },
    });

    return count > 0;
  }
}
