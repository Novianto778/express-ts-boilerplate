import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserReturn = z.infer<typeof UserReturnSchema>;

export type GetUser = z.infer<typeof GetUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type GetUserByEmail = z.infer<typeof GetUserByEmailSchema>;
export type GetAllUsers = z.infer<typeof GetAllUsersSchema>;
export type UserId = z.infer<typeof UserIdSchema>["id"];

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["ADMIN", "USER"]),
  password: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UserIdSchema = UserSchema.pick({ id: true });

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserReturnSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
  password: true,
});

// Input Validation for 'GET users' endpoint
export const GetAllUsersSchema = z.object({
  query: UserSchema.pick({ email: true, name: true, role: true }).partial(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: UserIdSchema,
});

export const UpdateUserSchema = z.object({
  params: UserIdSchema,
  body: UserCreateSchema,
});

export const GetUserByEmailSchema = z.object({
  params: UserSchema.pick({ email: true }),
});

export const CreateUserSchema = z.object({
  body: UserCreateSchema,
});
