import type { GetAllUsers, UserCreate, UserId } from "@/api/user/userModel";
import { prisma } from "@/common/lib/prisma";
import { queryParamsFilters } from "@/common/utils/queryParams";
import type { Prisma, User } from "@prisma/client";

type SelectUser = Prisma.UserGetPayload<{
  select?: Record<string, boolean>;
}>;

type Select = Record<string, boolean>;

export class UserRepository {
  async findAllAsync(queryParams: GetAllUsers["query"], select?: Record<string, boolean>): Promise<SelectUser[]> {
    // Build filters dynamically based on queryParams
    const filters = queryParamsFilters(queryParams);

    // Apply filters
    return prisma.user.findMany({
      select: select,
      where: filters,
    });
  }

  async findByIdAsync(id: UserId, select?: Select): Promise<User | null> {
    return prisma.user.findUnique({
      select: select,
      where: { id: id },
    });
  }

  async createAsync(user: UserCreate, select?: Select): Promise<User> {
    return prisma.user.create({
      select: select,
      data: user,
    });
  }

  async updateAsync(id: UserId, user: UserCreate, select?: Select): Promise<User | null> {
    return prisma.user.update({
      select: select,
      where: { id: id },
      data: user,
    });
  }

  async deleteAsync(id: UserId, select?: Select): Promise<User | null> {
    return prisma.user.delete({
      select: select,
      where: { id: id },
    });
  }

  async getByEmailAsync(email: string, select?: Select): Promise<User | null> {
    return prisma.user.findUnique({
      select: select,
      where: { email: email },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email: email },
    });
  }
}
