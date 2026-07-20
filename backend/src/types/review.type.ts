import { z } from "zod";

export const ReviewSchema = z.object({
    // reference to the customer who wrote the review
    customerId: z.string().min(1, "Customer is required"),
    // reference to the product being reviewed
    productId: z.string().min(1, "Product is required"),
    // rating between 1 and 5
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    // review comment
    comment: z.string().min(1, "Comment is required"),
});

export type ReviewType = z.infer<typeof ReviewSchema>;