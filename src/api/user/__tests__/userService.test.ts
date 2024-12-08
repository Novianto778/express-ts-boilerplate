import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { UserService } from "@/api/user/userService";
import { AppError } from "@/common/models/errorModel";
import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

vi.mock("@/api/user/userRepository");

describe("userService", () => {
  let userServiceInstance: UserService;
  let userRepositoryInstance: UserRepository;

  const mockUsers: User[] = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      password: "password",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Bob",
      email: "bob@example.com",
      password: "password",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    userRepositoryInstance = new UserRepository();
    userServiceInstance = new UserService(userRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all users", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockUsers);

      // Act
      const result = await userServiceInstance.findAll({});

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Users found");
      expect(result.data).toEqual(mockUsers);
    });

    it("returns a not found error for no users found", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await userServiceInstance.findAll({});

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("No users found");
      expect(result.data).toEqual([]);
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (userRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      try {
        const result = await userServiceInstance.findAll({});

        // Assert
        expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(result.success).toBeFalsy();
        expect(result.message).equals("An error occurred while retrieving users.");
        expect(result.data).toBeNull();
      } catch (error) {
        // Assert
        if (error instanceof Error) {
          expect(error.message).toEqual("Database error");
        }
      }
    });
  });

  describe("findById", () => {
    it("returns a user for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockUser = mockUsers.find((user) => user.id === testId);
      (userRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockUser);

      // Act
      const result = await userServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("User found");
      expect(result.data).toEqual({
        id: mockUser?.id,
        name: mockUser?.name,
        email: mockUser?.email,
        role: mockUser?.role,
      });
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (userRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));
      try {
        // Act
        const result = await userServiceInstance.findById(testId);

        // Assert
        expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
        expect(result.success).toBeFalsy();
        expect(result.message).equals("An error occurred while finding user.");
        expect(result.data).toBeNull();
      } catch (error) {
        // Assert
        if (error instanceof Error) {
          expect(error.message).toEqual("Database error");
        }
      }
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (userRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(
        new AppError("User not exist", StatusCodes.NOT_FOUND),
      );
      try {
        // Act
        const result = await userServiceInstance.findById(testId);

        // Assert
        expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
        expect(result.success).toBeFalsy();
        expect(result.message).equals("User not exist");
        expect(result.data).toBeNull();
      } catch (error) {
        // Assert
        if (error instanceof AppError) {
          expect(error.message).toEqual("User not exist");
        }
      }
    });
  });
});
