import { z } from "zod";

export const ProductSchema = z.object({
    // reference to category (Seed, Fertilizer, Tool, Equipment)
    categoryId: z.string().min(1, "Category is required"),
    // product name
    name: z.string().min(1, "Product name is required"),
    // product description
    description: z.string().min(1, "Description is required"),
    // price per unit in NPR
    price: z.number().positive("Price must be greater than 0"),
    // image path set by multer after upload
    imageUrl: z.string().optional(),
    // unit type (kg, litre, piece, packet)
    unit: z.enum(["kg", "litre", "piece", "packet"], {
        error: "Please select a unit type",
    }),
    // stock quantity
    stock: z.number().int().min(0, "Stock cannot be negative"),
    // availability status - true by default when product is added
    isAvailable: z.boolean().default(true),
});

export type ProductType = z.infer<typeof ProductSchema>;