import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CartModel } from "../../models/cart.model";
import { ProductModel } from "../../models/product.model";
import { CategoryModel } from "../../models/category.model";
import mongoose from "mongoose";

describe("Cart API Integration Tests", () => {
    let authToken: string;
    let testUserId: string;
    let testProductId: string;
    let testCartItemId: string;

    const testUser = {
        fullName: "Cart Test User",
        email: "carttest@example.com",
        contactNumber: "9800000001",
        password: "password123",
        confirmPassword: "password123",
    };

    beforeAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });
        await CartModel.deleteMany({});
        await ProductModel.deleteMany({ name: "Test Seed" });

        // Ensure category name matches your enum – adjust if needed
        const category = await CategoryModel.findOneAndUpdate(
            { name: "Seed Variety" },
            { name: "Seed Variety", description: "test category" },
            { upsert: true, new: true }
        );
        if (!category) throw new Error("Category creation failed");
        const categoryId = category._id.toString();

        const product = await ProductModel.create({
            name: "Test Seed",
            description: "Test seed for cart integration test",
            price: 500,
            unit: "kg",
            stock: 100,
            isAvailable: true,
            categoryId,
        });
        testProductId = product._id.toString();

        await request(app).post("/api/auth/register").send(testUser);
        const loginRes = await request(app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        authToken = loginRes.body.data.token;
        testUserId = loginRes.body.data._id;
    });

    afterAll(async () => {
        await CartModel.deleteMany({ customerId: testUserId });
        await ProductModel.findByIdAndDelete(testProductId);
        await UserModel.deleteOne({ email: testUser.email });
    });

    describe("POST /api/cart", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).post("/api/cart").send({
                productId: testProductId,
                quantity: 2,
            });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${authToken}`)
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should add product to cart successfully", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${authToken}`)
                .send({
                    productId: testProductId,
                    quantity: 2,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty("_id");
            expect(res.body.data.quantity).toBe(2);
            expect(res.body.data.totalPrice).toBe(1000); // 2 * 500
            testCartItemId = res.body.data._id;
        });

        test("should return 404 if product does not exist", async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const res = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ productId: fakeId, quantity: 1 });
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("GET /api/cart/my", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).get("/api/cart/my");
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return my active cart items", async () => {
            const res = await request(app)
                .get("/api/cart/my")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/cart/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).get(`/api/cart/${testCartItemId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return cart item by id", async () => {
            const res = await request(app)
                .get(`/api/cart/${testCartItemId}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(testCartItemId);
        });

        test("should return 404 if cart item not found", async () => {
            const res = await request(app)
                .get("/api/cart/000000000000000000000000")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PUT /api/cart/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/cart/${testCartItemId}`)
                .send({ quantity: 3 });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing quantity", async () => {
            const res = await request(app)
                .put(`/api/cart/${testCartItemId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should update cart item quantity", async () => {
            const res = await request(app)
                .put(`/api/cart/${testCartItemId}`)
                .set("Authorization", `Bearer ${authToken}`)
                .send({ quantity: 5 });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.quantity).toBe(5);
            expect(res.body.data.totalPrice).toBe(2500); // 5 * 500
        });
    });

    describe("PUT /api/cart/:id/cancel", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).put(`/api/cart/${testCartItemId}/cancel`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should cancel cart item successfully", async () => {
            const res = await request(app)
                .put(`/api/cart/${testCartItemId}/cancel`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe("cancelled");
        });

        test("should return 400 if cart item already cancelled", async () => {
            const res = await request(app)
                .put(`/api/cart/${testCartItemId}/cancel`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/cart/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(`/api/cart/${testCartItemId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete cart item successfully", async () => {
            const addRes = await request(app)
                .post("/api/cart")
                .set("Authorization", `Bearer ${authToken}`)
                .send({ productId: testProductId, quantity: 1 });
            expect(addRes.statusCode).toBe(200);
            const newId = addRes.body.data._id;

            const res = await request(app)
                .delete(`/api/cart/${newId}`)
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart item removed successfully");
        });

        test("should return 404 if cart item not found", async () => {
            const res = await request(app)
                .delete("/api/cart/000000000000000000000000")
                .set("Authorization", `Bearer ${authToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});