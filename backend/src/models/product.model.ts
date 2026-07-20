import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { ProductType } from "../types/product.type";

export interface IProduct
    extends Omit<ProductType, "categoryId">,
    Document {
    _id: mongoose.Types.ObjectId;
    // omit categoryId to redefine as ObjectId reference
    categoryId: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductMongoSchema: Schema = new Schema<IProduct>(
    {
        // reference to category (Seed, Fertilizer, Tool, Equipment)
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        // product name
        name: { type: String, required: true },
        // product description
        description: { type: String, required: true },
        // price per unit in NPR
        price: { type: Number, required: true },
        // image path set by multer after upload
        imageUrl: { type: String },
        // unit type
        unit: {
            type: String,
            enum: ["kg", "litre", "piece", "packet"],
            required: true,
        },
        // stock quantity
        stock: { type: Number, required: true, default: 0 },
        // availability status - true by default when product is added
        isAvailable: { type: Boolean, default: true },
    },
    {
        timestamps: true, // createdAt and updatedAt auto managed by mongoose
    },
);

export const ProductModel: Model<IProduct> = mongoose.model<IProduct>(
    "Product", // creates "products" collection in mongodb
    ProductMongoSchema,
);