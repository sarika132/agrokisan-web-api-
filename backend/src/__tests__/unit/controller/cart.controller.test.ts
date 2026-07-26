import { Request, Response } from "express";
import { CartController } from "../../../controllers/cart.controller";
import { CartModel } from "../../../models/cart.model";
import { ProductModel } from "../../../models/product.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

// helper to create a fake Express response with jest spies
const mockResponse = (): Response => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};

// Unit tests for CartController - mocks req/res, uses real service and test DB
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
            { upsert: true, new: true },
        );
        customerId = user._id.toString();

        const product = await ProductModel.create({
            name: "Controller Test Product",
            description: "test product for controller tests",
            price: 600,
            unit: "kg" as const,
            stock: 50,
            isAvailable: true,
            categoryId: new mongoose.Types.ObjectId() as any,
        });
        productId = product._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: "Controller Test Product" });
        await CartModel.deleteMany({ customerId });
    });

    describe("addToCart", () => {
        test("should return 200 and add item to cart with valid data", async () => {
            const req = {
                body: { productId, quantity: 2 },
                user: { _id: customerId },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(true);
            expect(jsonArg.data.totalPrice).toBe(1200); // 2 * 600
            cartItemId = jsonArg.data._id.toString();
        });

        test("should return 400 for missing required fields", async () => {
            const req = {
                body: { productId }, // missing quantity
                user: { _id: customerId },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });

        test("should return 401 if no user on request", async () => {
            const req = {
                body: { productId, quantity: 1 },
                user: undefined,
            } as unknown as Request;
            const res = mockResponse();

            await cartController.addToCart(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
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
        test("should return 200 with the cart item", async () => {
            const req = { params: { id: cartItemId } } as unknown as Request;
            const res = mockResponse();

            await cartController.getCartItemById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data._id.toString()).toBe(cartItemId);
        });

        test("should return 404 for non-existing cart item", async () => {
            const req = {
                params: { id: "000000000000000000000000" },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.getCartItemById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe("updateCartItem", () => {
        test("should return 200 and update quantity", async () => {
            const req = {
                params: { id: cartItemId },
                body: { quantity: 5 },
                user: { _id: customerId },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.updateCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.quantity).toBe(5);
            expect(jsonArg.data.totalPrice).toBe(3000); // 5 * 600
        });

        test("should return 400 for invalid quantity", async () => {
            const req = {
                params: { id: cartItemId },
                body: { quantity: 0 }, // min is 1
                user: { _id: customerId },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.updateCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe("cancelCartItem", () => {
        test("should return 200 when cancelling an active cart item", async () => {
            const req = {
                params: { id: cartItemId },
                user: { _id: customerId, role: "user" },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.cancelCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.data.status).toBe("cancelled");
        });

        test("should return 400 when cancelling an already cancelled item", async () => {
            const req = {
                params: { id: cartItemId },
                user: { _id: customerId, role: "user" },
            } as unknown as Request;
            const res = mockResponse();

            await cartController.cancelCartItem(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            const jsonArg = (res.json as jest.Mock).mock.calls[0][0];
            expect(jsonArg.success).toBe(false);
        });
    });
});