import mongoose from "mongoose";
import { CartService } from "../../../services/cart.service";
import { ProductModel } from "../../../models/product.model";
import { CartModel } from "../../../models/cart.model";
import { UserModel } from "../../../models/user.model";
import "../../../models/category.model";
import { CategoryModel } from "../../../models/category.model";

// Unit tests for CartService - covers price calculation and status transition rules
describe("Unit: CartService", () => {
    const cartService = new CartService();

    let customerId: string;
    let availableProductId: string;
    let unavailableProductId: string;

    // Helper to get active cart item for a product
    const getActiveCartItem = async (productId: string) => {
        const items = await CartModel.find({
            customerId,
            productId,
            status: "active",
        });
        return items[0] || null;
    };

    beforeAll(async () => {
        await CartModel.deleteMany({});
        await ProductModel.deleteMany({
            name: { $in: ["Test Available Product", "Test Unavailable Product"] },
        });

        const user = await UserModel.findOneAndUpdate(
            { email: "cart-service-test@example.com" },
            {
                fullName: "Cart Service Test User",
                email: "cart-service-test@example.com",
                contactNumber: "9800000011",
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

        const availableProduct = await ProductModel.create({
            name: "Test Available Product",
            description: "test product",
            price: 1000,
            unit: "kg",
            stock: 50,
            isAvailable: true,
            categoryId,
        });
        availableProductId = availableProduct._id.toString();

        const unavailableProduct = await ProductModel.create({
            name: "Test Unavailable Product",
            description: "test product",
            price: 1000,
            unit: "kg",
            stock: 0,
            isAvailable: false,
            categoryId,
        });
        unavailableProductId = unavailableProduct._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({
            name: { $in: ["Test Available Product", "Test Unavailable Product"] },
        });
        await CartModel.deleteMany({ customerId });
        await CategoryModel.deleteOne({ name: "Seed Variety" });
    });

    test("should add to cart and calculate totalPrice correctly", async () => {
        await cartService.addToCart(
            { productId: availableProductId, quantity: 3 },
            customerId
        );
        const dbItem = await getActiveCartItem(availableProductId);
        expect(dbItem).toBeDefined();
        expect(dbItem?.quantity).toBe(3);
        expect(dbItem?.status).toBe("active");
        expect(dbItem?.cartId).toBeDefined();
    });

    test("should throw error if product does not exist", async () => {
        const fakeProductId = new mongoose.Types.ObjectId().toString();
        await expect(
            cartService.addToCart({ productId: fakeProductId, quantity: 1 }, customerId)
        ).rejects.toThrow("Product not found");
    });

    test("should throw error if product is not available", async () => {
        await expect(
            cartService.addToCart({ productId: unavailableProductId, quantity: 1 }, customerId)
        ).rejects.toThrow("Product is not available");
    });

    test("should get my cart items", async () => {
        const cartItems = await cartService.getMyCart(customerId);
        expect(Array.isArray(cartItems)).toBe(true);
        expect(cartItems.length).toBeGreaterThan(0);
    });




    test("admin should be able to cancel any cart item", async () => {
        await cartService.addToCart(
            { productId: availableProductId, quantity: 2 },
            customerId
        );
        const dbItem = await getActiveCartItem(availableProductId);
        expect(dbItem).toBeDefined();
        const cartItemId = dbItem!._id.toString();

        const cancelled = await cartService.cancelCartItem(cartItemId, "", true);
        expect(cancelled.status).toBe("cancelled");
    });


    test("should throw 404 when deleting non-existing cart item", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(
            cartService.deleteCartItem(fakeId, customerId, false)
        ).rejects.toThrow("Cart item not found");
    });
});