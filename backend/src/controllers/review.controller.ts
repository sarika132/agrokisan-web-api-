import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { CreateReviewDTO, UpdateReviewDTO } from "../dtos/review.dto";
import { ReviewService } from "../services/review.service";

const reviewService = new ReviewService();

export class ReviewController {
    // user - create a new review for a product
    async createReview(req: Request, res: Response) {
        try {
            const reviewData = CreateReviewDTO.safeParse({
                ...req.body,
                // convert rating from string to number since it comes as string from request
                rating: parseInt(req.body.rating),
            });

            if (!reviewData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(reviewData.error),
                    400,
                );
            }

            // get customerId from JWT token set by authorizedMiddleware
            const customerId = (req as any).user?._id;
            if (!customerId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const review = await reviewService.createReview(
                reviewData.data,
                customerId,
            );
            return ApiResponseHelper.success(
                res,
                review,
                "Review created successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // public - get all reviews for a specific product
    async getReviewsByProductId(req: Request, res: Response) {
        try {
            const { productId } = req.params as { productId: string };
            const reviews = await reviewService.getReviewsByProductId(productId);
            return ApiResponseHelper.success(
                res,
                reviews,
                "Reviews fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // user - update their own review
    async updateReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const reviewData = UpdateReviewDTO.safeParse({
                ...req.body,
                ...(req.body.rating && { rating: parseInt(req.body.rating) }),
            });

            if (!reviewData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(reviewData.error),
                    400,
                );
            }

            const customerId = (req as any).user?._id;
            if (!customerId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }

            const review = await reviewService.updateReview(
                id,
                reviewData.data,
                customerId,
            );
            return ApiResponseHelper.success(
                res,
                review,
                "Review updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // user - delete their own review
    async deleteReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const customerId = (req as any).user?._id;
            if (!customerId) {
                return ApiResponseHelper.error(res, "Unauthorized", 401);
            }
            await reviewService.deleteReview(id, customerId);
            return ApiResponseHelper.success(
                res,
                null,
                "Review deleted successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // public - get featured reviews for homepage
    async getFeaturedReviews(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
            const reviews = await reviewService.getFeaturedReviews(limit);
            return ApiResponseHelper.success(
                res,
                reviews,
                "Featured reviews fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - get all reviews paginated
    async getAllReviewsPaginated(req: Request, res: Response) {
        try {
            const page = parseInt((req.query.page as string) || "1");
            const limit = parseInt((req.query.limit as string) || "10");
            const { data, total } = await reviewService.getAllReviewsPaginated(
                page,
                limit,
            );
            const pagination = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            };
            return ApiResponseHelper.success(
                res,
                data,
                "Reviews fetched successfully",
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

    // admin - delete any review
    async adminDeleteReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await reviewService.adminDeleteReview(id);
            return ApiResponseHelper.success(res, null, "Review deleted successfully");
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}