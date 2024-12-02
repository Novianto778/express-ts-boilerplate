import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserCreateSchema, UserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get(
  "/",
  validateRequest({
    query: GetUserSchema.shape.query,
  }),
  userController.getUsers,
);

userRegistry.registerPath({
  method: "get",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get(
  "/:id",
  validateRequest({
    params: GetUserSchema.shape.params,
  }),
  userController.getUser,
);

userRegistry.registerPath({
  method: "post",
  path: "/users",
  tags: ["User"],
  request: {
    body: { content: { "application/json": { schema: UserCreateSchema } } },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.post("/", userController.createUser);

userRegistry.registerPath({
  method: "put",
  path: "/users/{id}",
  tags: ["User"],
  request: {
    params: GetUserSchema.shape.params,
    body: { content: { "application/json": { schema: UserCreateSchema } } },
  },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.put(
  "/:id",
  validateRequest({
    params: GetUserSchema.shape.params,
    body: UserCreateSchema,
  }),
  userController.updateUser,
);

userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(UserSchema, "Success"),
});

userRouter.delete(
  "/:id",
  validateRequest({
    params: GetUserSchema.shape.params,
  }),
  userController.deleteUser,
);

userRouter.get(
  "/email/:email",
  validateRequest({
    params: z.object({
      email: z.string().email(),
    }),
  }),
  userController.getByEmail,
);
