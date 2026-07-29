import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { CartType } from "../types/cart.type";

export interface ICart
    extends Omit<CartType, "customerId" | "productId">,
    Document {
    _id: mongoose.Types.ObjectId;
    customerId: ObjectId | string;
    productId: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const CartMongoSchema: Schema = new Schema<ICart>(
    {
        cartId: { type: String, unique: true, sparse: true },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        priceAtAdded: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ["active", "checkedout", "cancelled"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const CartModel: Model<ICart> = mongoose.model<ICart>("Cart", CartMongoSchema);