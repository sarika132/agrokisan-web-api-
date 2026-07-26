import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProductController } from "../../../controllers/product.controller";
import { ProductModel } from "../../../models/product.model";
import { CategoryModel } from "../../../models/category.model";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Unit tests for ProductController - mocks req/res, uses real service and test DB
describe("Unit: ProductController", () => {
    const productController = new ProductController();
    let productId: string;

    beforeAll(async () => {
        await ProductModel.deleteMany({ name: "Controller Test Product 2" });
        const product = await ProductModel.create({
            name: "Controller Test Product 2",
            description: "test product for controller tests",
            price: 550,
            unit: "kg" as const,
            stock: 30,
            isAvailable: true,
            categoryId: new mongoose.Types.ObjectId() as any,
        });
        productId = product._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: "Controller Test Product 2" });
    });

    describe("getAllProducts", () => {
        test("should return 200 with a list of products", async () => {
            const req = {} as unknown as Request;
            const res = mockResponse();

            await productController.getAllProducts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(Array.isArray(jsonArg.data)).toBe(true);
        });
    });

    describe("getProductById", () => {
        test("should return 200 with the product", async () => {
            const req = { params: { id: productId } } as unknown as Request;
            const res = mockResponse();

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data._id.toString()).toBe(productId);
        });

        test("should return 404 for non-existing product id", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const req = { params: { id: fakeId } } as unknown as Request;
            const res = mockResponse();

            await productController.getProductById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });
    });
});