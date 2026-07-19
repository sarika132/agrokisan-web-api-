import { CartService } from "../services/cart.service";
import { z } from "zod";
import { AddToCartDTO, UpdateCartDTO, UpdateCartStatusDTO } from "../dtos/cart.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
}

const cartService = new CartService();

export class CartController {
    // POST /api/cart - add item to cart
    async addToCart(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cartData = AddToCartDTO.safeParse(req.body);
            if (!cartData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(cartData.error),
                    400,
                );
            }
            const cartItem = await cartService.addToCart(cartData.data, customerId);
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Item added to cart successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // GET /api/cart/my - get current user's active cart
    async getMyCart(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cart = await cartService.getMyCart(customerId);
            return ApiResponseHelper.success(res, cart, "Cart retrieved successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // GET /api/cart/:id - get single cart item by id
    async getCartItemById(req: Request, res: Response) {
        try {
            const cartItemId = req.params.id as string;
            if (!cartItemId) {
                return ApiResponseHelper.error(res, "Cart item ID is required", 400);
            }
            const cartItem = await cartService.getCartItemById(cartItemId);
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item retrieved successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // GET /api/admin/cart - get all cart items paginated (admin only)
    async getAllCartsPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search, status }: QueryParams = req.query;
            const pageNum = parseInt(page || "1");
            const limitNum = parseInt(limit || "10");

            const { data, total } = await cartService.getAllCartsPaginated(
                pageNum,
                limitNum,
                search,
                status,
            );

            const pagination = {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum) || 1,
            };

            return ApiResponseHelper.success(
                res,
                data,
                "Cart items retrieved successfully",
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

    // PUT /api/cart/:id - update cart item quantity
    async updateCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cartItemId = req.params.id as string;
            const cartData = UpdateCartDTO.safeParse(req.body);
            if (!cartData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(cartData.error),
                    400,
                );
            }
            const updated = await cartService.updateCartItem(
                cartItemId,
                cartData.data,
                customerId,
            );
            return ApiResponseHelper.success(
                res,
                updated,
                "Cart item updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // PUT /api/cart/:id/checkout - checkout a cart item
    async checkoutCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cartItemId = req.params.id as string;
            const updated = await cartService.checkoutCartItem(cartItemId, customerId);
            return ApiResponseHelper.success(
                res,
                updated,
                "Cart item checked out successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // PUT /api/cart/:id/cancel - cancel a cart item
    async cancelCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const cartItemId = req.params.id as string;
            const updated = await cartService.cancelCartItem(
                cartItemId,
                customerId,
                isAdmin,
            );
            return ApiResponseHelper.success(
                res,
                updated,
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

    // DELETE /api/cart/:id - remove cart item
    async deleteCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const cartItemId = req.params.id as string;
            await cartService.deleteCartItem(cartItemId, customerId, isAdmin);
            return ApiResponseHelper.success(res, null, "Cart item removed successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}