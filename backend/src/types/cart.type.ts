import { z } from "zod";

export const CartSchema = z.object({
    customerId: z.string().min(1, "Customer is required"),
    productId: z.string().min(1, "Product is required"),
    addedDate: z.coerce.date(),
    totalPrice: z.number().positive("Total price must be greater than 0"),
    status: z
        .enum(["confirmed", "checkout", "cancelled"])
        .default("confirmed"),
    bookingId: z.string().optional(),
});

export type CartType = z.infer<typeof CartSchema>;