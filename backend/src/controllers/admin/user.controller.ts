import { UserService } from "../../services/user.service";
import { z } from "zod";
import { RegisterUserDTO } from "../../dtos/user.dto";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const userData = RegisterUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400,
                );
            }
            const user = await userService.registerUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}