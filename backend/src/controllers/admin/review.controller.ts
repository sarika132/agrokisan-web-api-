import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { ReviewService } from "../../services/review.service";

const reviewService = new ReviewService();

export class AdminReviewController {
    // admin - get all reviews with pagination
    async getAllReviewsPaginated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await reviewService.getAllReviewsPaginated(page, limit);

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

    // admin - delete any review
    async deleteReview(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await reviewService.adminDeleteReview(id);
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
}