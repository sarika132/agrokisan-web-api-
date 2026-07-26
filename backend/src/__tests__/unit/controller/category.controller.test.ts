import { Request, Response } from "express";
import mongoose from "mongoose";
import { AdminCategoryController } from "../../../controllers/admin/category.controller";
import { CategoryModel } from "../../../models/category.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Unit tests for AdminCategoryController - mocks req/res, uses real service and test DB
describe("Unit: AdminCategoryController", () => {
    const categoryController = new AdminCategoryController();
    let categoryId: string;

    beforeAll(async () => {
        await CategoryModel.deleteMany({ name: "Agriculture Equipment" });
    });

    afterAll(async () => {
        await CategoryModel.deleteMany({ name: "Agriculture Equipment" });
    });

    describe("getAllCategories", () => {
        test("should return 200 with a list of categories", async () => {
            const req = {} as unknown as Request;
            const res = mockResponse();

            await categoryController.getAllCategories(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(Array.isArray(jsonArg.data)).toBe(true);
        });
    });

    describe("createCategory", () => {
        test("should return 200 and create a category", async () => {
            const req = {
                body: {
                    name: "Agriculture Equipment",
                    description: "test category for controller tests",
                },
            } as unknown as Request;
            const res = mockResponse();

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.name).toBe("Agriculture Equipment");
            categoryId = jsonArg.data._id.toString();
        });

        test("should return 400 for invalid category data", async () => {
            const req = {
                body: { name: "Not A Real Category" }, // invalid enum, missing description
            } as unknown as Request;
            const res = mockResponse();

            await categoryController.createCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });
    });

    describe("updateCategory", () => {
        test("should return 200 and update the category", async () => {
            const req = {
                params: { id: categoryId },
                body: { description: "updated via controller" },
            } as unknown as Request;
            const res = mockResponse();

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.description).toBe("updated via controller");
        });

        test("should return 404 for non-existing category id", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const req = {
                params: { id: fakeId },
                body: { description: "doesn't matter" },
            } as unknown as Request;
            const res = mockResponse();

            await categoryController.updateCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe("deleteCategory", () => {
        test("should return 200 when deleting the category", async () => {
            const req = { params: { id: categoryId } } as unknown as Request;
            const res = mockResponse();

            await categoryController.deleteCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(true);
        });
    });
});