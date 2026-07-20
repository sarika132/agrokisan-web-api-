import { z } from "zod";
import { ReviewSchema } from "../types/review.type";

// Create Review DTO - customerId comes from JWT, not from request body
export const CreateReviewDTO = ReviewSchema.omit({ customerId: true }).extend({
    productId: z.string().min(1, "Product is required"),
});
export type CreateReviewDTO = z.infer<typeof CreateReviewDTO>;

// Update Review DTO - only rating and comment can be updated
export const UpdateReviewDTO = ReviewSchema.pick({
    rating: true,
    comment: true,
}).partial();
export type UpdateReviewDTO = z.infer<typeof UpdateReviewDTO>;