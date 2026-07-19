import { z } from "zod";

export const SeedsSchema = z.object({
    productId: z.string().min(1, "Product  is required"),
    categoryId: z.string().min(1, "Category is required"),
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    pricePerDay: z.number().positive("Price must be greater than 0"),
    imageUrl: z.string().optional(),
    isAvailable: z.boolean().default(true),
});

export type SeedsType = z.infer<typeof SeedsSchema>;