import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserReturn = z.infer<typeof UserReturnSchema>;

export type GetUser = z.infer<typeof GetUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type GetUserByEmail = z.infer<typeof GetUserByEmailSchema>;
export type GetAllUsers = z.infer<typeof GetAllUsersSchema>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserCreateSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UserReturnSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
});

// Input Validation for 'GET users' endpoint
export const GetAllUsersSchema = z.object({
  query: z
    .object({
      age: z.number(),
      email: z.string().email(),
    })
    .partial(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});

export const UpdateUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: UserCreateSchema,
});

export const GetUserByEmailSchema = z.object({
  params: z.object({ email: z.string().email() }),
});

export const CreateUserSchema = z.object({
  body: UserCreateSchema,
});
