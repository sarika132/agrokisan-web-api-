import { z } from "zod";
import { CartSchema } from "../types/cart.type";

// Add to Cart DTO - user only sends productId and quantity
export const AddToCartDTO = CartSchema.pick({
    productId: true,
    quantity: true,
});
export type AddToCartDTO = z.infer<typeof AddToCartDTO>;

// Update Cart Item DTO - user can only update quantity
export const UpdateCartDTO = CartSchema.pick({
    quantity: true,
});
export type UpdateCartDTO = z.infer<typeof UpdateCartDTO>;

// Update Cart Status DTO - admin only (checkout or cancel)
export const UpdateCartStatusDTO = CartSchema.pick({
    status: true,
});
export type UpdateCartStatusDTO = z.infer<typeof UpdateCartStatusDTO>;