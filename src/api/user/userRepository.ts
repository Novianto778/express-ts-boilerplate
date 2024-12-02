import type { GetUser, User, UserCreate } from "@/api/user/userModel";
import type { QueryFilter } from "@/common/utils/queryParams";

export const users: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    age: 42,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 2,
    name: "Robert",
    email: "Robert@example.com",
    age: 21,
    createdAt: new Date(),
    updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
];

export class UserRepository {
  async findAllAsync(queryParams: GetUser["query"]): Promise<User[]> {
    const filters: QueryFilter<GetUser["query"]> = {};

    // Build filters dynamically based on queryParams
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        filters[key] = value;
      }
    });

    // Apply filters
    return users.filter((user) => {
      return Object.entries(filters).every(([key, value]) => {
        return user[key as keyof User] === value;
      });
    });
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return users.find((user) => user.id === id) || null;
  }

  async createAsync(user: UserCreate): Promise<User> {
    const newUser: User = {
      id: users.length + 1,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  async updateAsync(id: number, user: UserCreate): Promise<User | null> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return null;
    }
    const updatedUser: User = {
      ...users[index],
      ...user,
      updatedAt: new Date(),
    };
    users[index] = updatedUser;
    return updatedUser;
  }

  async deleteAsync(id: number): Promise<User | null> {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return null;
    }
    const deletedUser = users.splice(index, 1)[0];
    return deletedUser;
  }

  async getByEmailAsync(email: string): Promise<User | null> {
    return users.find((user) => user.email === email) || null;
  }
}
