import { z } from "zod";
import { ProductSchema } from "../types/product.type";

// Create Product DTO - imageUrl omitted because multer sets it after upload
export const CreateProductDTO = ProductSchema.omit({
    imageUrl: true,
});
export type CreateProductDTO = z.infer<typeof CreateProductDTO>;

// Update Product DTO - all fields optional, only send what needs to change
export const UpdateProductDTO = ProductSchema.partial();
export type UpdateProductDTO = z.infer<typeof UpdateProductDTO>;