import { UserService } from "../services/user.service";
import { z } from "zod";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

const userService = new UserService();

// query params interface for paginated user list
interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

export class AdminUserController {
    // GET /api/v1/admin/users - get all users with pagination and search
    async getAllUserPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const { data, pagination } = await userService.getAllUserPaginated(
                page,
                limit,
                search,
            );
            return ApiResponseHelper.success(
                res,
                data,
                "Users retrieved successfully",
                200,
                pagination,
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // GET /api/v1/admin/users/:id - get single user by id
    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            if (!userId) {
                return ApiResponseHelper.error(res, "User ID is required", 400);
            }
            const user = await userService.getUserById(userId);
            return ApiResponseHelper.success(
                res,
                user,
                "User retrieved successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // POST /api/v1/admin/users - admin creates a user with role assignment
    async createUser(req: Request, res: Response) {
        try {
            const userData = CreateUserDTOAdmin.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400,
                );
            }
            const user = await userService.createUser(userData.data);
            return ApiResponseHelper.success(res, user, "User created successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // PUT /api/v1/admin/users/:id - admin updates a user
    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            const userData = UpdateUserDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400,
                );
            }

            // set image url if file was uploaded via multer
            if (req.file) {
                userData.data.imageUrl = "/uploads/" + req.file.filename;
            }

            const updatedUser = await userService.updateUser(userId, userData.data);
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

    // PUT /api/v1/admin/users/:id/password - admin updates a user's password
    async updatePassword(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            const userData = UpdatePasswordDTO.safeParse(req.body);
            if (!userData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(userData.error),
                    400,
                );
            }

            // verify current password before allowing change
            const isValid = await userService.checkPassword(
                userId,
                userData.data.currentPassword,
            );
            if (!isValid) {
                return ApiResponseHelper.error(
                    res,
                    "Current password is incorrect",
                    400,
                );
            }

            // reuse updateUser service - just pass the new password
            const updatedUser = await userService.updateUser(userId, {
                password: userData.data.newPassword,
            });
            return ApiResponseHelper.success(
                res,
                updatedUser,
                "Password updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // DELETE /api/v1/admin/users/:id - admin deletes a user
    async deleteUser(req: Request, res: Response) {
        try {
            const userId = req.params.id as string;
            const deleted = await userService.deleteUser(userId);
            if (!deleted) {
                return ApiResponseHelper.error(res, "User not found", 404);
            }
            return ApiResponseHelper.success(res, null, "User deleted successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}