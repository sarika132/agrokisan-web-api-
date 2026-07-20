import { z } from "zod";
import { CollectionSchema } from "../types/collection.type";

// Create Collection DTO - all fields required
export const CreateCollectionDTO = CollectionSchema.pick({
    name: true,
    description: true,
});
export type CreateCollectionDTO = z.infer<typeof CreateCollectionDTO>;

// Update Collection DTO - all fields optional, send only what you want to change
export const UpdateCollectionDTO = CollectionSchema.partial();
export type UpdateCollectionDTO = z.infer<typeof UpdateCollectionDTO>;