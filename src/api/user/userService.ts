import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<User[] | null>> {
    const users = await this.userRepository.findAllAsync();
    if (!users || users.length === 0) {
      return ServiceResponse.success<User[]>("No users found", []);
    }
    return ServiceResponse.success<User[]>("Users found", users);
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<User | null>> {
    const user = await this.userRepository.findByIdAsync(id);
    if (!user) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User>("User found", user);
  }
}

export const userService = new UserService();
