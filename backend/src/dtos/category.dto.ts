import { z } from "zod";
import { CategorySchema } from "../types/category.type";

// Create Category DTO - all fields required
export const CreateCategoryDTO = CategorySchema.pick({
    name: true,
    description: true,
});
export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTO>;

// Update Category DTO - all fields optional
export const UpdateCategoryDTO = CategorySchema.partial();
export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTO>;