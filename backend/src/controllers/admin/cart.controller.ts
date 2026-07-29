import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CartService } from "../../services/cart.service";
import mongoose from "mongoose";

const cartService = new CartService();

export class AdminCartController {
    // GET /api/admin/cart
    async getAllCartsPaginated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;

            const result = await cartService.getAllCartsPaginated(
                page,
                limit,
                search,
                status,
            );

            return ApiResponseHelper.success(
                res,
                {
                    data: result.data,
                    pagination: {
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit),
                    },
                },
                "Cart items fetched successfully",
            );
        } catch (error: any) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    async getCartItemById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            const cartItem = await cartService.getCartItemById(id);
            if (!cartItem) {
                return ApiResponseHelper.error(res, "Cart item not found", 404);
            }
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item fetched successfully",
            );
        } catch (error: any) {
            if (error.message === "Cart item not found") {
                return ApiResponseHelper.error(res, "Cart item not found", 404);
            }
            if (error.name === "CastError") {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    async cancelCartItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            const cartItem = await cartService.cancelCartItem(id, "", true);
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item cancelled successfully",
            );
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.message === "This cart item cannot be cancelled") status = 400;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }

    async deleteCartItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            await cartService.deleteCartItem(id, "", true);
            return ApiResponseHelper.success(
                res,
                null,
                "Cart item deleted successfully",
            );
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }
}