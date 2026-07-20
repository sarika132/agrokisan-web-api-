import mongoose, { Schema, Document, Model, ObjectId } from "mongoose";
import { ReviewType } from "../types/review.type";

export interface IReview
    extends Omit<ReviewType, "customerId" | "productId">,
    Document {
    _id: mongoose.Types.ObjectId;
    // omit customerId and productId to redefine as ObjectId reference
    customerId: ObjectId | string;
    productId: ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewMongoSchema: Schema = new Schema<IReview>(
    {
        // reference to the user who wrote the review
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // reference to the product being reviewed
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        // rating must be between 1 and 5
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: { type: String, required: true },
    },
    {
        timestamps: true, // createdAt and updatedAt auto managed by mongoose
    },
);

export const ReviewModel: Model<IReview> = mongoose.model<IReview>(
    "Review", // creates "reviews" collection in mongodb
    ReviewMongoSchema,
);