import { z } from "zod";

export const CategorySchema = z.object({
    name: z.enum([
        "Seeds",
        "Fertilizers",
        "Tools",
        "Equipments"
    ]),
    description: z.string().min(1, "Description is required"),
});

export type CategoryType = z.infer<typeof CategorySchema>;