import { z } from "zod";

export const CollectionSchema = z.object({
    name: z.enum([
        "Seeds",
        "Fertilizers",
        "Tools",
        "Equipments"
    ]),
    description: z.string().min(1, "Description is required"),
});

export type CollectionType = z.infer<typeof CollectionSchema>;