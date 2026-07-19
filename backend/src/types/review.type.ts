import { z } from "zod";

export const ReviewSchema = z.object({
    customerId: z.string().min(1, "Customer is required"),
    productId: z.string().min(1, "Product is required"),
    rating: z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    comment: z.string().min(1, "Comment is required"),
});

export type ReviewType = z.infer<typeof ReviewSchema>;