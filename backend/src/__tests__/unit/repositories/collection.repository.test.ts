import mongoose from "mongoose";
import { CollectionMongoRepository } from "../../../repositories/collection.repository";
import { CollectionModel } from "../../../models/collection.model";

// Unit tests for CollectionMongoRepository
describe("Unit: CollectionMongoRepository", () => {
    const collectionRepository = new CollectionMongoRepository();
    let collectionId: string;

    beforeAll(async () => {
        await CollectionModel.deleteMany({ name: "Agriculture Tools" });
    });

    afterAll(async () => {
        await CollectionModel.deleteMany({ name: "Agriculture Tools" });
    });

    test("should create a collection", async () => {
        const collection = await collectionRepository.createCollection({
            name: "Agriculture Tools",
            description: "test collection for repo tests",
        } as any);
        expect(collection).toBeDefined();
        expect(collection.name).toBe("Agriculture Tools");
        collectionId = collection._id.toString();
    });

    test("should find collection by id", async () => {
        const found = await collectionRepository.getCollectionById(collectionId);
        expect(found).toBeDefined();
        expect(found?.name).toBe("Agriculture Tools");
    });

    test("should find collection by name", async () => {
        const found = await collectionRepository.getCollectionByName("Agriculture Tools");
        expect(found).toBeDefined();
        expect(found?._id.toString()).toBe(collectionId);
    });

    test("should return null for non-existing collection name", async () => {
        const found = await collectionRepository.getCollectionByName("Nonexistent Collection" as any);
        expect(found).toBeNull();
    });

    test("should get all collections", async () => {
        const collections = await collectionRepository.getAll();
        expect(Array.isArray(collections)).toBe(true);
        expect(collections.length).toBeGreaterThan(0);
    });

    test("should update a collection", async () => {
        const updated = await collectionRepository.update(collectionId, {
            description: "updated via repository",
        } as any);
        expect(updated?.description).toBe("updated via repository");
    });

    test("should delete a collection", async () => {
        const deleted = await collectionRepository.delete(collectionId);
        expect(deleted).toBe(true);
    });

    test("should return null when getting a deleted collection by id", async () => {
        const found = await collectionRepository.getCollectionById(collectionId);
        expect(found).toBeNull();
    });
});