import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { CartType } from "../types/cart.type";

export interface ICart
    extends Omit<CartType, "customerId" | "productId">,
    Document {
    _id: mongoose.Types.ObjectId;
    // omit customerId and productId to redefine as ObjectId reference
    customerId: ObjectId | string;
    productId: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const CartMongoSchema: Schema = new Schema<ICart>(
    {
        // custom readable cart id e.g. CART3c889e
        cartId: { type: String, unique: true, sparse: true },

        // reference to the user who added to cart
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // reference to the product being added (seed/fertilizer/tool/equipment)
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        // how many units the user wants
        quantity: { type: Number, required: true, min: 1 },

        // price snapshot at the time item was added to cart
        priceAtAdded: { type: Number, required: true },

        // calculated automatically in service layer: quantity * priceAtAdded
        totalPrice: { type: Number, required: true },

        // active = in cart, checkedout = order placed, cancelled = removed
        status: {
            type: String,
            enum: ["active", "checkedout", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true, // createdAt and updatedAt auto managed by mongoose
    },
);

export const CartModel: Model<ICart> = mongoose.model<ICart>(
    "Cart", // creates "carts" collection in mongodb
    CartMongoSchema,
);