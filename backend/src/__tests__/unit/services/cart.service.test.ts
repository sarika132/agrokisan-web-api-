import mongoose from "mongoose";
import { CartService } from "../../../services/cart.service";
import { ProductModel } from "../../../models/product.model";
import { CartModel } from "../../../models/cart.model";
import { UserModel } from "../../../models/user.model";

// Unit tests for CartService - covers price calculation and status transition rules
describe("Unit: CartService", () => {
    const cartService = new CartService();

    let customerId: string;
    let availableProductId: string;
    let unavailableProductId: string;

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
            { upsert: true, new: true },
        );
        customerId = user._id.toString();

        const availableProduct = await ProductModel.create({
            name: "Test Available Product",
            description: "test product",
            price: 1000,
            unit: "kg" as const,
            stock: 50,
            isAvailable: true,
        });
        availableProductId = availableProduct._id.toString();

        const unavailableProduct = await ProductModel.create({
            name: "Test Unavailable Product",
            description: "test product",
            price: 1000,
            unit: "kg" as const,
            stock: 0,
            isAvailable: false,
        });
        unavailableProductId = unavailableProduct._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({
            name: { $in: ["Test Available Product", "Test Unavailable Product"] },
        });
        await CartModel.deleteMany({ customerId });
    });

    test("should add to cart and calculate totalPrice correctly", async () => {
        const cartItem = await cartService.addToCart(
            { productId: availableProductId, quantity: 3 },
            customerId,
        );
        // 3 units * NPR 1000 per unit
        expect(cartItem.totalPrice).toBe(3000);
        expect(cartItem.status).toBe("active");
        expect(cartItem.cartId).toBeDefined();
    });

    test("should throw error if product does not exist", async () => {
        const fakeProductId = new mongoose.Types.ObjectId().toString();
        await expect(
            cartService.addToCart({ productId: fakeProductId, quantity: 1 }, customerId),
        ).rejects.toThrow("Product not found");
    });

    test("should throw error if product is not available", async () => {
        await expect(
            cartService.addToCart(
                { productId: unavailableProductId, quantity: 1 },
                customerId,
            ),
        ).rejects.toThrow("Product is not available");
    });

    test("should get my cart items", async () => {
        const cartItems = await cartService.getMyCart(customerId);
        expect(Array.isArray(cartItems)).toBe(true);
        expect(cartItems.length).toBeGreaterThan(0);
    });

    test("should update cart item quantity and recalculate totalPrice", async () => {
        const cartItems = await cartService.getMyCart(customerId);
        const cartItemId = cartItems[0]._id.toString();

        const updated = await cartService.updateCartItem(
            cartItemId,
            { quantity: 5 },
            customerId,
        );
        expect(updated.quantity).toBe(5);
        expect(updated.totalPrice).toBe(5000); // 5 * 1000
    });

    test("should cancel a cart item", async () => {
        const cartItems = await cartService.getMyCart(customerId);
        const cartItemId = cartItems[0]._id.toString();

        const cancelled = await cartService.cancelCartItem(cartItemId, customerId, false);
        expect(cancelled.status).toBe("cancelled");
    });

    test("should not cancel an already cancelled cart item", async () => {
        // add new item and cancel it
        const cartItem = await cartService.addToCart(
            { productId: availableProductId, quantity: 1 },
            customerId,
        );
        const cartItemId = cartItem._id.toString();
        await cartService.cancelCartItem(cartItemId, customerId, false);

        await expect(
            cartService.cancelCartItem(cartItemId, customerId, false),
        ).rejects.toThrow("This cart item cannot be cancelled");
    });

    test("admin should be able to cancel any cart item", async () => {
        const cartItem = await cartService.addToCart(
            { productId: availableProductId, quantity: 2 },
            customerId,
        );
        const cartItemId = cartItem._id.toString();

        const cancelled = await cartService.cancelCartItem(cartItemId, "", true);
        expect(cancelled.status).toBe("cancelled");
    });

    test("should delete a cart item", async () => {
        const cartItem = await cartService.addToCart(
            { productId: availableProductId, quantity: 1 },
            customerId,
        );
        const cartItemId = cartItem._id.toString();

        await expect(
            cartService.deleteCartItem(cartItemId, customerId, false),
        ).resolves.not.toThrow();
    });

    test("should throw 404 when deleting non-existing cart item", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(
            cartService.deleteCartItem(fakeId, customerId, false),
        ).rejects.toThrow("Cart item not found");
    });
});