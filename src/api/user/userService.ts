import { StatusCodes } from "http-status-codes";

import { type GetAllUsers, type User, type UserCreate, type UserReturn, UserReturnSchema } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { AppError } from "@/common/models/errorModel";
import { ServiceResponse } from "@/common/models/serviceResponse";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Retrieves all users from the database
  async findAll(queryParams: GetAllUsers["query"]): Promise<ServiceResponse<User[] | null>> {
    const users = await this.userRepository.findAllAsync(queryParams);
    if (!users || users.length === 0) {
      return ServiceResponse.success<User[]>("No users found", []);
    }
    return ServiceResponse.success<User[]>("Users found", users);
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<UserReturn | null>> {
    const user = await this.userRepository.findByIdAsync(id);
    if (!user) {
      throw new AppError("User not exist", StatusCodes.NOT_FOUND);
    }
    // transform user to UserReturn
    const res = UserReturnSchema.safeParse(user);
    if (res.error) {
      throw new AppError("Invalid user data", StatusCodes.BAD_REQUEST);
    }

    return ServiceResponse.success<UserReturn>("User found", res.data);
  }

  // Creates a new user in the database
  async create(user: UserCreate): Promise<ServiceResponse<User>> {
    const newUser = await this.userRepository.createAsync(user);
    return ServiceResponse.success<User>("User created", newUser, StatusCodes.CREATED);
  }

  // Updates an existing user in the database
  async update(id: number, user: UserCreate): Promise<ServiceResponse<User | null>> {
    const updatedUser = await this.userRepository.updateAsync(id, user);
    if (!updatedUser) {
      throw new AppError("User not exist", StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User>("User updated", updatedUser);
  }

  // Deletes a user from the database
  async delete(id: number): Promise<ServiceResponse<User | null>> {
    const deletedUser = await this.userRepository.deleteAsync(id);
    if (!deletedUser) {
      throw new AppError("User not exist", StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User>("User deleted", deletedUser);
  }

  async getByEmail(email: string): Promise<ServiceResponse<User | null>> {
    const user = await this.userRepository.getByEmailAsync(email);
    if (!user) {
      throw new AppError("User not exist", StatusCodes.NOT_FOUND);
    }
    return ServiceResponse.success<User>("User found", user);
  }
}

export const userService = new UserService();
