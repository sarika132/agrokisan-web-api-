import mongoose from "mongoose";
import { CollectionService } from "../../../services/collection.service";
import { CollectionModel } from "../../../models/collection.model";

// Unit tests for CollectionService
describe("Unit: CollectionService", () => {
    const collectionService = new CollectionService();
    let collectionId: string;

    beforeAll(async () => {
        await CollectionModel.deleteMany({ name: "Agriculture Equipment" as any });
    });

    afterAll(async () => {
        await CollectionModel.deleteMany({ name: "Agriculture Equipment" as any });
    });

    test("should create a collection", async () => {
        const collection = await collectionService.createCollection({
            name: "Agriculture Equipment",
            description: "test collection for service tests",
        } as any);
        expect(collection).toBeDefined();
        expect(collection.name).toBe("Agriculture Equipment");
        collectionId = collection._id.toString();
    });

    test("should throw error when creating a duplicate collection name", async () => {
        await expect(
            collectionService.createCollection({
                name: "Agriculture Equipment",
                description: "duplicate attempt",
            } as any),
        ).rejects.toThrow('Collection "Agriculture Equipment" already exists');
    });

    test("should get all collections", async () => {
        const collections = await collectionService.getAllCollections();
        expect(Array.isArray(collections)).toBe(true);
        expect(collections.length).toBeGreaterThan(0);
    });

    test("should update a collection", async () => {
        const updated = await collectionService.updateCollection(collectionId, {
            description: "updated description",
        } as any);
        expect(updated.description).toBe("updated description");
    });

    test("should throw 404 when updating non-existing collection", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(
            collectionService.updateCollection(fakeId, { description: "x" } as any),
        ).rejects.toThrow("Collection not found");
    });

    test("should delete a collection", async () => {
        const deleted = await collectionService.deleteCollection(collectionId);
        expect(deleted).toBe(true);
    });

    test("should throw 404 when deleting non-existing collection", async () => {
        await expect(collectionService.deleteCollection(collectionId)).rejects.toThrow(
            "Collection not found",
        );
    });
});