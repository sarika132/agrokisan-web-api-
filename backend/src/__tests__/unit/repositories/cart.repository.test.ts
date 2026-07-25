import mongoose from "mongoose";
import { CartMongoRepository } from "../../../repositories/cart.repository";
import { CartModel } from "../../../models/cart.model";
import { ProductModel } from "../../../models/product.model";
import { UserModel } from "../../../models/user.model";

// Unit tests for CartMongoRepository
describe("Unit: CartMongoRepository", () => {
    const cartRepository = new CartMongoRepository();

    let customerId: string;
    let productId: string;
    let cartItemIdToTest: string;

    beforeAll(async () => {
        await CartModel.deleteMany({});
        await ProductModel.deleteMany({ name: "Repo Test Product" });

        const user = await UserModel.findOneAndUpdate(
            { email: "cart-repo-test@example.com" },
            {
                fullName: "Cart Repo Test User",
                email: "cart-repo-test@example.com",
                contactNumber: "9800000010",
                password: "hashedpasswordplaceholder",
                role: "user",
            },
            { upsert: true, new: true },
        );
        customerId = user._id.toString();

        const product = await ProductModel.create({
            name: "Repo Test Product",
            description: "test product for cart repo tests",
            price: 500,
            unit: "kg" as const,
            stock: 100,
            isAvailable: true,
        });
        productId = product._id.toString();
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: "Repo Test Product" });
        await CartModel.deleteMany({ customerId });
    });

    test("should create a cart item", async () => {
        const cartItem = await cartRepository.createCartItem({
            customerId,
            productId,
            quantity: 2,
            priceAtAdded: 500,
            totalPrice: 1000,
            status: "active",
        } as any);

        expect(cartItem).toBeDefined();
        expect(cartItem).toHaveProperty("_id");
        expect(cartItem.status).toBe("active");
        expect(cartItem.totalPrice).toBe(1000);
        cartItemIdToTest = cartItem._id.toString();
    });

    test("should find cart item by id with populated product and customer", async () => {
        const found = await cartRepository.getCartItemById(cartItemIdToTest);
        expect(found).toBeDefined();
        expect((found as any).productId.name).toBe("Repo Test Product");
        expect((found as any).customerId.email).toBe("cart-repo-test@example.com");
    });

    test("should return null for non-existing cart item id", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const found = await cartRepository.getCartItemById(fakeId);
        expect(found).toBeNull();
    });

    test("should update cartId with custom readable id", async () => {
        await cartRepository.updateCartId(cartItemIdToTest, "CARTTESTID1");
        const found = await cartRepository.getCartItemById(cartItemIdToTest);
        expect(found).toBeDefined();
        expect((found as any).cartId).toBe("CARTTESTID1");
    });

    test("should update cart item quantity and totalPrice", async () => {
        const updated = await cartRepository.updateCartItem(cartItemIdToTest, 5, 2500);
        expect(updated?.quantity).toBe(5);
        expect(updated?.totalPrice).toBe(2500);
    });

    test("should get all active cart items for a specific customer", async () => {
        const cartItems = await cartRepository.getCartByCustomerId(customerId);
        expect(cartItems.length).toBeGreaterThan(0);
        expect(cartItems[0].customerId.toString()).toBe(customerId);
    });

    test("should get all cart items paginated", async () => {
        const result = await cartRepository.getAllPaginated(1, 10);
        expect(result.data).toBeDefined();
        expect(result.total).toBeGreaterThan(0);
    });

    test("should filter paginated cart items by status", async () => {
        const result = await cartRepository.getAllPaginated(1, 10, undefined, "active");
        expect(result.data.every((c: any) => c.status === "active")).toBe(true);
    });

    test("should update cart item status to cancelled", async () => {
        const updated = await cartRepository.updateStatus(cartItemIdToTest, "cancelled");
        expect(updated?.status).toBe("cancelled");
    });

    test("should delete a cart item", async () => {
        const deleted = await cartRepository.deleteCartItem(cartItemIdToTest);
        expect(deleted).toBeDefined();
    });
});