import { type PrismaClient } from "@/generated/prisma";
import prisma from "@/lib/prisma-client";

export abstract class BaseRepository {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  // abstract create(data: Partial<T>): Promise<T>;

  // abstract delete(id: string): Promise<void>;

  // abstract findById(id: string): Promise<null | T>;

  // abstract update(id: string, data: Partial<T>): Promise<T>;
}
