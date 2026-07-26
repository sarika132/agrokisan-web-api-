import { Request, Response } from "express";
import mongoose from "mongoose";
import { AdminCollectionController } from "../../../controllers/admin/collection.controller";
import { CollectionModel } from "../../../models/collection.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Unit tests for AdminCollectionController - mocks req/res, uses real service and test DB
describe("Unit: AdminCollectionController", () => {
    const collectionController = new AdminCollectionController();
    let collectionId: string;

    beforeAll(async () => {
        await CollectionModel.deleteMany({ name: "Fertilizers and Pesticides" as any });
    });

    afterAll(async () => {
        await CollectionModel.deleteMany({ name: "Fertilizers and Pesticides" as any });
    });

    describe("getAllCollections", () => {
        test("should return 200 with a list of collections", async () => {
            const req = {} as unknown as Request;
            const res = mockResponse();

            await collectionController.getAllCollections(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(Array.isArray(jsonArg.data)).toBe(true);
        });
    });

    describe("createCollection", () => {
        test("should return 200 and create a collection", async () => {
            const req = {
                body: {
                    name: "Fertilizers and Pesticides",
                    description: "test collection for controller tests",
                },
            } as unknown as Request;
            const res = mockResponse();

            await collectionController.createCollection(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.name).toBe("Fertilizers and Pesticides");
            collectionId = jsonArg.data._id.toString();
        });

        test("should return 400 for invalid collection data", async () => {
            const req = {
                body: { name: "Not A Real Collection" }, // invalid enum, missing description
            } as unknown as Request;
            const res = mockResponse();

            await collectionController.createCollection(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });
    });

    describe("updateCollection", () => {
        test("should return 200 and update the collection", async () => {
            const req = {
                params: { id: collectionId },
                body: { description: "updated via controller" },
            } as unknown as Request;
            const res = mockResponse();

            await collectionController.updateCollection(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.description).toBe("updated via controller");
        });

        test("should return 404 for non-existing collection id", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const req = {
                params: { id: fakeId },
                body: { description: "doesn't matter" },
            } as unknown as Request;
            const res = mockResponse();

            await collectionController.updateCollection(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe("deleteCollection", () => {
        test("should return 200 when deleting the collection", async () => {
            const req = { params: { id: collectionId } } as unknown as Request;
            const res = mockResponse();

            await collectionController.deleteCollection(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(true);
        });
    });
});