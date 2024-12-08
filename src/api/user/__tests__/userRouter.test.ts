import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { GetUserSchema, type User } from "@/api/user/userModel";
// import { users } from "@/api/user/userRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { zodErrorMessage } from "@/common/utils/zodError";
import { app } from "@/server";
import type { ZodError } from "zod";

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

describe("User API Endpoints", () => {
  describe("GET /users", () => {
    it("should return a list of users", async () => {
      // Act
      const response = await request(app).get("/users");
      const responseBody: ServiceResponse<User[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Users found");
      // expect(responseBody.data.length).toEqual(mockUsers.length);
      // responseBody.data.forEach((user, index) =>
      //   compareUsers(mockUsers[index] as User, user)
      // );
    });
  });

  describe("GET /users/:id", () => {
    it("should return a user for a valid ID", async () => {
      // Arrange
      const testId = 1;
      // const expectedUser = mockUsers.find((user) => user.id === testId) as User;

      // Act
      const response = await request(app).get(`/users/${testId}`);
      const responseBody: ServiceResponse<User> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("User found");
      // if (!expectedUser)
      //   throw new Error("Invalid test data: expectedUser is undefined");
      // compareUsers(expectedUser, responseBody.data);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 999999;

      // Act
      const response = await request(app).get(`/users/${testId}`);

      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("User not exist");
      expect(responseBody.data).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Act
      const invalidInput = "abc";
      const response = await request(app).get(`/users/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;
      const res = GetUserSchema.safeParse({ params: { id: invalidInput } });
      const errorMessages = zodErrorMessage(res.error as ZodError);

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain(errorMessages);
      expect(responseBody.data).toBeNull();
    });
  });
});

// function compareUsers(mockUser: User, responseUser: User) {
//   if (!mockUser || !responseUser) {
//     throw new Error("Invalid test data: mockUser or responseUser is undefined");
//   }

//   expect(responseUser.id).toEqual(mockUser.id);
//   expect(responseUser.name).toEqual(mockUser.name);
//   expect(responseUser.email).toEqual(mockUser.email);
//   expect(responseUser.role).toEqual(mockUser.role);
//   // expect(new Date(responseUser.createdAt)).toEqual(mockUser.createdAt);
//   // expect(new Date(responseUser.updatedAt)).toEqual(mockUser.updatedAt);
// }
