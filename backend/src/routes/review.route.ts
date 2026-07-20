import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../middlewares/authorized.middleware";

const reviewRoute = Router();
const reviewController = new ReviewController();

// ── Public routes (no auth required) ──────────────────────────
// GET /api/reviews/featured           → featured reviews for homepage
reviewRoute.get("/featured", (req, res) =>
    reviewController.getFeaturedReviews(req, res),
);

// GET /api/reviews/product/:productId → all reviews for a product
reviewRoute.get("/product/:productId", (req, res) =>
    reviewController.getReviewsByProductId(req, res),
);

// POST /api/reviews                   → create a review
reviewRoute.post("/", authorizedMiddleware, (req, res) =>
    reviewController.createReview(req, res),
);

// PUT /api/reviews/:id                → update own review
reviewRoute.put("/:id", authorizedMiddleware, (req, res) =>
    reviewController.updateReview(req, res),
);

// DELETE /api/reviews/:id             → delete own review
reviewRoute.delete("/:id", authorizedMiddleware, (req, res) =>
    reviewController.deleteReview(req, res),
);

// GET /api/reviews/admin/all          → all reviews paginated
reviewRoute.get(
    "/admin/all",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => reviewController.getAllReviewsPaginated(req, res),
);

// DELETE /api/reviews/admin/:id       → admin deletes any review
reviewRoute.delete(
    "/admin/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => reviewController.adminDeleteReview(req, res),
);

export default reviewRoute;