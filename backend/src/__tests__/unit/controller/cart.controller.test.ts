import { Request, Response } from "express";
import { CartController } from "../../../controllers/cart.controller";
import { CartModel } from "../../../models/cart.model";
import { ProductModel } from "../../../models/product.model";
import { UserModel } from "../../../models/user.model";
import { CategoryModel } from "../../../models/category.model";
import mongoose from "mongoose";

const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

describe("Unit: CartController", () => {
    const cartController = new CartController();
    let customerId: string;
    let productId: string;
    let cartItemId: string;

    beforeAll(async () => {
        await CartModel.deleteMany({});
        await ProductModel.deleteMany({ name: "Controller Test Product" });

        const user = await UserModel.findOneAndUpdate(
            { email: "cart-controller-test@example.com" },
            {
                fullName: "Cart Controller Test User",
                email: "cart-controller-test@example.com",
                contactNumber: "9800000012",
                password: "hashedpasswordplaceholder",
                role: "user",
            },
            { upsert: true, new: true }
        );
        customerId = user._id.toString();

        const category = await CategoryModel.findOneAndUpdate(
            { name: "Seed Variety" },
            { name: "Seed Variety", description: "test" },
            { upsert: true, new: true }
        );
        const categoryId = category._id.toString();

        const product = await ProductModel.create({
            name: "Controller Test Product",
            description: "test product for controller tests",
            price: 600,
            unit: "kg",
            stock: 50,
            isAvailable: true,
            categoryId,
        });
        productId = product._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: "Controller Test Product" });
        await CartModel.deleteMany({ customerId });
        await CategoryModel.deleteOne({ name: "Seed Variety" });
    });

    describe("addToCart", () => {


        test("should return 400 for missing required fields", async () => {
            const req = {
                body: { productId },
                user: { _id: customerId },
            } as unknown as Request;
            const res = mockResponse();
            await cartController.addToCart(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });


    });

    describe("getMyCart", () => {
        test("should return 200 with cart items for logged in user", async () => {
            const req = { user: { _id: customerId } } as unknown as Request;
            const res = mockResponse();
            await cartController.getMyCart(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(Array.isArray(jsonArg.data)).toBe(true);
        });
    });

    describe("getCartItemById", () => {


        test("should return 404 for non-existing cart item", async () => {
            const req = { params: { id: "000000000000000000000000" } } as unknown as Request;
            const res = mockResponse();
            await cartController.getCartItemById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        });
    });



    test("should return 400 for invalid quantity", async () => {
        // Use a fake ID for the test
        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            body: { quantity: 0 },
            user: { _id: customerId },
        } as unknown as Request;
        const res = mockResponse();
        await cartController.updateCartItem(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });


});