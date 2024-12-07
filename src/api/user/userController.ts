import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { parseQueryParams } from "@/common/utils/queryParams";
import type { GetAllUsers } from "./userModel";

class UserController {
  public getUsers: RequestHandler = async (req: Request, res: Response) => {
    const queryParams = parseQueryParams<GetAllUsers["query"]>(req);

    const serviceResponse = await userService.findAll(queryParams);
    return handleServiceResponse(serviceResponse, res);
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public createUser: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await userService.create(req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.update(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  };

  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.delete(id);
    return handleServiceResponse(serviceResponse, res);
  };

  public getByEmail: RequestHandler = async (req: Request, res: Response) => {
    const email = req.params.email as string;
    const serviceResponse = await userService.getByEmail(email);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const userController = new UserController();
