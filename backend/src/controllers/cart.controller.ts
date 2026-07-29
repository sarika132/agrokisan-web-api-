import { CartService } from "../services/cart.service";
import { z } from "zod";
import { AddToCartDTO, UpdateCartDTO } from "../dtos/cart.dto";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { Request, Response } from "express";
import mongoose from "mongoose";

const cartService = new CartService();

export class CartController {
    // POST /api/cart
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
                200
            );
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Product not found") status = 404;
            else if (error.message === "Product is not available") status = 400;
            else if (error.message === "Insufficient stock") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }

    async getMyCart(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cart = await cartService.getMyCart(customerId);
            return ApiResponseHelper.success(res, cart, "Cart retrieved successfully");
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
            const cartItemId = req.params.id as string;
            if (!cartItemId) {
                return ApiResponseHelper.error(res, "Cart item ID is required", 400);
            }
            if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            const cartItem = await cartService.getCartItemById(cartItemId);
            if (!cartItem) {
                return ApiResponseHelper.error(res, "Cart item not found", 404);
            }
            return ApiResponseHelper.success(
                res,
                cartItem,
                "Cart item retrieved successfully",
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

    async updateCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cartItemId = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
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
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.message === "You can only update your own cart") status = 403;
            else if (error.message === "Only active cart items can be updated") status = 400;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }

    async checkoutCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const cartItemId = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            const updated = await cartService.checkoutCartItem(cartItemId, customerId);
            return ApiResponseHelper.success(
                res,
                updated,
                "Cart item checked out successfully",
            );
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.message === "Only active cart items can be checked out") status = 400;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }

    async cancelCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const cartItemId = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
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
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.message === "You can only cancel your own cart items") status = 403;
            else if (error.message === "This cart item cannot be cancelled") status = 400;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }

    async deleteCartItem(req: Request, res: Response) {
        try {
            const customerId = (req.user as any)._id.toString();
            const isAdmin = (req.user as any).role === "admin";
            const cartItemId = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
                return ApiResponseHelper.error(res, "Invalid cart item ID", 400);
            }
            await cartService.deleteCartItem(cartItemId, customerId, isAdmin);
            return ApiResponseHelper.success(res, null, "Cart item removed successfully");
        } catch (error: any) {
            let status = 500;
            let message = error.message || "Internal Server Error";
            if (error.message === "Cart item not found") status = 404;
            else if (error.message === "You can only delete your own cart items") status = 403;
            else if (error.name === "CastError") status = 400;
            return ApiResponseHelper.error(res, message, status);
        }
    }
}