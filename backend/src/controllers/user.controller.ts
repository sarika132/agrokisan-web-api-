import { UserService } from "../services/user.service";
import { z } from "zod";
import { RegisterUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    async registerUser(req: Request, res: Response) {
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
            return ApiResponseHelper.success(
                res,
                user,
                "User registered successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    async loginUser(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(parsedData.error),
                    400,
                );
            }
            const { user, token } = await userService.loginUser(parsedData.data);
            return ApiResponseHelper.success(
                res,
                { user, token },
                "Login successful",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}