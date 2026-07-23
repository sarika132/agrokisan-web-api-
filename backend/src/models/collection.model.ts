import mongoose, { Schema, Document, Model } from "mongoose";
import { CollectionType } from "../types/collection.type";

export interface ICollection extends CollectionType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CollectionMongoSchema: Schema = new Schema<ICollection>(
    {
        // collection name - must be one of the 4 AgroKisan categories
        name: {
            type: String,
            enum: [
                "Seeds",
                "Fertilizers",
                "Tools",
                "Equipments",
            ],
            required: true,
            unique: true,
        },
        // collection description
        description: { type: String, required: true },
    },
    {
        timestamps: true, // createdAt and updatedAt auto managed by mongoose
    },
);

export const CollectionModel: Model<ICollection> = mongoose.model<ICollection>(
    "Collection", // creates "collections" collection in mongodb
    CollectionMongoSchema,
);
