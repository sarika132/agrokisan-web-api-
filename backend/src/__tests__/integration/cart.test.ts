import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CartModel } from "../../models/cart.model";
import { ProductModel } from "../../models/product.model";

// Integration tests for the Cart API
// This describes test suite for the Cart API integration tests.
describe(
    "Cart API Integration Tests", // suite name
    () => {
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

        const testProduct = {
            name: "Test Seed",
            description: "Test seed for cart integration test",
            price: 500,
            unit: "kg",
            stock: 100,
            isAvailable: true,
        };

        // runs once before all tests - register user, login, create test product
        beforeAll(async () => {
            // clean up any leftover test data
            await UserModel.deleteOne({ email: testUser.email });

            // register test user
            await request(app).post("/api/auth/register").send(testUser);

            // login to get auth token
            const loginRes = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: testUser.password,
            });
            authToken = loginRes.body.data.token;
            testUserId = loginRes.body.data._id;

            // create a test product directly in DB (product creation is admin only)
            const product = await ProductModel.create(testProduct);
            testProductId = product._id.toString();
        });

        // runs once after all tests - clean up test data
        afterAll(async () => {
            await CartModel.deleteMany({ customerId: testUserId });
            await ProductModel.findByIdAndDelete(testProductId);
            await UserModel.deleteOne({ email: testUser.email });
        });

        // 1. Add to cart endpoint tests
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
                    .send({
                        // missing productId and quantity
                    });

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
                expect(res.body.data.productId.toString()).toBe(testProductId);
                expect(res.body.data.quantity).toBe(2);
                expect(res.body.data.status).toBe("active");
                expect(res.body.data.totalPrice).toBe(testProduct.price * 2);

                // save cart item id for later tests
                testCartItemId = res.body.data._id;
            });

            test("should return 404 if product does not exist", async () => {
                const res = await request(app)
                    .post("/api/cart")
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({
                        productId: "000000000000000000000000", // non-existent id
                        quantity: 1,
                    });

                expect(res.statusCode).toBe(404);
                expect(res.body.success).toBe(false);
            });
        });

        // 2. Get my cart endpoint tests
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

        // 3. Get single cart item endpoint tests
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

        // 4. Update cart item quantity endpoint tests
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
                    .send({
                        // missing quantity
                    });

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
                // totalPrice should be recalculated
                expect(res.body.data.totalPrice).toBe(testProduct.price * 5);
            });
        });

        // 5. Cancel cart item endpoint tests
        describe("PUT /api/cart/:id/cancel", () => {
            test("should return 401 if not logged in", async () => {
                const res = await request(app).put(
                    `/api/cart/${testCartItemId}/cancel`,
                );

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
                // try to cancel again - already cancelled above
                const res = await request(app)
                    .put(`/api/cart/${testCartItemId}/cancel`)
                    .set("Authorization", `Bearer ${authToken}`);

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
            });
        });

        // 6. Delete cart item endpoint tests
        describe("DELETE /api/cart/:id", () => {
            test("should return 401 if not logged in", async () => {
                const res = await request(app).delete(
                    `/api/cart/${testCartItemId}`,
                );

                expect(res.statusCode).toBe(401);
                expect(res.body.success).toBe(false);
            });

            test("should delete cart item successfully", async () => {
                // add a fresh item to delete
                const addRes = await request(app)
                    .post("/api/cart")
                    .set("Authorization", `Bearer ${authToken}`)
                    .send({ productId: testProductId, quantity: 1 });

                const newCartItemId = addRes.body.data._id;

                const res = await request(app)
                    .delete(`/api/cart/${newCartItemId}`)
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
    },
);