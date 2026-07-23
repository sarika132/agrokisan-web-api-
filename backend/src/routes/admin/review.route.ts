import { Router } from "express";
import { AdminReviewController } from "../../controllers/admin/review.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../../middlewares/authorized.middleware";

const adminReviewRoute = Router();
const adminReviewController = new AdminReviewController();

// admin only - get all reviews with pagination
adminReviewRoute.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    adminReviewController.getAllReviewsPaginated,
);

// admin only - delete any review
adminReviewRoute.delete(
    "/delete/:id",
    authorizedMiddleware,
    adminMiddleware,
    adminReviewController.deleteReview,
);

export default adminReviewRoute;git add.