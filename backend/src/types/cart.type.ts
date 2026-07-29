import { z } from "zod";

export const CartSchema = z.object({
    cartId: z.string().optional(),
    customerId: z.string(),
    productId: z.string(),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    priceAtAdded: z.number(),
    totalPrice: z.number(),
    status: z.enum(["active", "checkedout", "cancelled"]).default("active"),
});

export type CartType = z.infer<typeof CartSchema>;