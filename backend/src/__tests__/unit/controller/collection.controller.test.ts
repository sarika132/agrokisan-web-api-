import { Request, Response } from "express";
import mongoose from "mongoose";
import { AdminCollectionController } from "../../../controllers/admin/collection.controller";
import { CollectionModel } from "../../../models/collection.model";

const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("Unit: AdminCollectionController", () => {
    const collectionController = new AdminCollectionController();
    let collectionId: string;

    beforeAll(async () => {
        await CollectionModel.deleteMany({ name: "Tools" as any });
    });

    afterAll(async () => {
        await CollectionModel.deleteMany({ name: "Tools" as any });
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
                    name: "Tools",
                    description: "test collection for controller tests",
                },
                user: { _id: new mongoose.Types.ObjectId().toString(), role: "admin" },
            } as unknown as Request;
            const res = mockResponse();
            await collectionController.createCollection(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.name).toBe("Tools");
            collectionId = jsonArg.data._id.toString();
        });

        test("should return 400 for invalid collection data", async () => {
            const req = {
                body: { name: "Not A Real Collection" },
                user: { _id: new mongoose.Types.ObjectId().toString(), role: "admin" },
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
                user: { _id: new mongoose.Types.ObjectId().toString(), role: "admin" },
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
                user: { _id: new mongoose.Types.ObjectId().toString(), role: "admin" },
            } as unknown as Request;
            const res = mockResponse();
            await collectionController.updateCollection(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe("deleteCollection", () => {
        test("should return 200 when deleting the collection", async () => {
            const req = {
                params: { id: collectionId },
                user: { _id: new mongoose.Types.ObjectId().toString(), role: "admin" },
            } as unknown as Request;
            const res = mockResponse();
            await collectionController.deleteCollection(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(true);
        });
    });
});