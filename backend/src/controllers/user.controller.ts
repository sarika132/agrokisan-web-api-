import { UserService } from "../services/user.service";
import { z } from "zod";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
    resetPassword(arg0: string, resetPassword: any) {
        throw new Error("Method not implemented.");
    }
    sendResetPasswordEmail(arg0: string, sendResetPasswordEmail: any) {
        throw new Error("Method not implemented.");
    }
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

    // Whoami
    async whoami(req: Request, res: Response) {
        try {
            const user = req.user;
            if (!user) {
                return ApiResponseHelper.error(res, "User not found", 404);
            }
            return ApiResponseHelper.success(res, user, "User retrieved successfully",
            );
        }
        catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500
            );
        }
    }

    // Update logged in user
    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            const filename = req.file?.filename;

            if (!userId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const parsedData = UpdateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(parsedData.error),
                    400,
                );
            }

            // Exclude role from updates
            const { role, ...allowedUpdates } = parsedData.data;

            if (filename) {
                allowedUpdates.profileImage = "/uploads/" + filename;
            }

            const updatedUser = await userService.updateUser(
                userId as string,
                allowedUpdates,
            );

            return ApiResponseHelper.success(
                res,
                updatedUser,
                "User updated successfully",
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