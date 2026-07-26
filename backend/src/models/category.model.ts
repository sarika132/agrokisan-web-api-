import mongoose, { Schema, Document, Model } from "mongoose";
import { CategoryType } from "../types/category.type";

export interface ICategory extends CategoryType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CategoryMongoSchema: Schema = new Schema<ICategory>(
    {
        name: {
            type: String,
            name: {
                type: String,
                required: true,
            },

        },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

export const CategoryModel: Model<ICategory> = mongoose.model<ICategory>(
    "Category",
    CategoryMongoSchema,
);