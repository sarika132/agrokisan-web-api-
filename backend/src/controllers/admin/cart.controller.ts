import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CartService } from "../../services/cart.service";

const cartService = new CartService();

export class AdminCartController {
    // admin - get all cart items with pagination, search and status filter
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
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - get single cart item by id
    async getCartItemById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const cartItem = await cartService.getCartItemById(id);
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - cancel any active or checkedout cart item
    async cancelCartItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            // isAdmin = true so admin can cancel any cart item
            const cartItem = await cartService.cancelCartItem(
                id,
                "",
                true,
            );
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item cancelled successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - delete any cart item permanently
    async deleteCartItem(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            // isAdmin = true so admin can delete any cart item
            await cartService.deleteCartItem(id, "", true);
            return ApiResponseHelper.success(
                res,
                null,
                "Cart item deleted successfully",
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