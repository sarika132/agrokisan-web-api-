import { z } from "zod";
import { CartSchema } from "../types/cart.type";

export const AddToCartDTO = CartSchema.pick({
    productId: true,
    quantity: true,
});
export type AddToCartDTO = z.infer<typeof AddToCartDTO>;

export const UpdateCartDTO = CartSchema.pick({
    quantity: true,
});
export type UpdateCartDTO = z.infer<typeof UpdateCartDTO>;

export const UpdateCartStatusDTO = CartSchema.pick({
    status: true,
});
export type UpdateCartStatusDTO = z.infer<typeof UpdateCartStatusDTO>;