import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ProductModel } from "../../models/product.model";
import { CollectionModel } from "../../models/collection.model";

// Integration tests for the Product API
describe("Product API Integration Tests", () => {
    let adminToken: string;
    let testProductId: string;
    let testCollectionId: string;

    const adminUser = {
        fullName: "Admin User",
        email: "adminproduct@example.com",
        contactNumber: "9800000002",
        password: "password123",
        confirmPassword: "password123",
    };

    // runs once before all tests
    beforeAll(async () => {
        // clean up any leftover test data
        await UserModel.deleteOne({ email: adminUser.email });

        // register and login admin user
        await request(app).post("/api/auth/register").send(adminUser);
        const loginRes = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: adminUser.password,
        });
        adminToken = loginRes.body.data.token;

        // set user role to admin directly in DB
        await UserModel.findOneAndUpdate(
            { email: adminUser.email },
            { role: "admin" },
        );

        // re-login to get fresh admin token
        const adminLoginRes = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: adminUser.password,
        });
        adminToken = adminLoginRes.body.data.token;

        // create a test collection for product reference
        const collection = await CollectionModel.create({
            name: "Seeds",
            description: "Test collection for product tests",
        });
        testCollectionId = collection._id.toString();
    });

    // runs once after all tests
    afterAll(async () => {
        await ProductModel.deleteMany({ name: /Test Product/i });
        await CollectionModel.findByIdAndDelete(testCollectionId);
        await UserModel.deleteOne({ email: adminUser.email });
    });

    // 1. Create product endpoint tests
    describe("POST /api/admin/products/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/products/create")
                .send({
                    name: "Test Product",
                    description: "Test description",
                    price: 500,
                    unit: "kg",
                    stock: 100,
                    isAvailable: true,
                    categoryId: testCollectionId,
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return 403 if not admin", async () => {
            // register a regular user
            await request(app).post("/api/auth/register").send({
                fullName: "Regular User",
                email: "regular@example.com",
                contactNumber: "9800000003",
                password: "password123",
                confirmPassword: "password123",
            });
            const loginRes = await request(app).post("/api/auth/login").send({
                email: "regular@example.com",
                password: "password123",
            });
            const regularToken = loginRes.body.data.token;

            const res = await request(app)
                .post("/api/admin/products/create")
                .set("Authorization", `Bearer ${regularToken}`)
                .send({
                    name: "Test Product",
                    description: "Test description",
                    price: 500,
                    unit: "kg",
                    stock: 100,
                    isAvailable: true,
                    categoryId: testCollectionId,
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);

            // cleanup regular user
            await UserModel.deleteOne({ email: "regular@example.com" });
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/products/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    // missing required fields
                    name: "Test Product",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create product successfully", async () => {
            const res = await request(app)
                .post("/api/admin/products/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Test Product One",
                    description: "Test description for product one",
                    price: "500",       // sent as string from form-data
                    stock: "100",       // sent as string from form-data
                    unit: "kg",
                    isAvailable: "true",
                    categoryId: testCollectionId,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product created successfully");
            expect(res.body.data.name).toBe("Test Product One");
            expect(res.body.data.price).toBe(500);
            expect(res.body.data.stock).toBe(100);

            // save product id for later tests
            testProductId = res.body.data._id;
        });
    });

    // 2. Get all products (public) endpoint tests
    describe("GET /api/products", () => {
        test("should return all available products without auth", async () => {
            const res = await request(app).get("/api/products");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // 3. Get all products paginated (admin) endpoint tests
    describe("GET /api/admin/products", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).get("/api/admin/products");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return paginated products for admin", async () => {
            const res = await request(app)
                .get("/api/admin/products?page=1&limit=10")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.data).toBeDefined();
            expect(res.body.data.pagination).toBeDefined();
            expect(res.body.data.pagination.page).toBe(1);
            expect(res.body.data.pagination.limit).toBe(10);
        });

        test("should search products by name", async () => {
            const res = await request(app)
                .get("/api/admin/products?search=Test Product One")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.data.length).toBeGreaterThan(0);
        });
    });

    // 4. Get single product endpoint tests
    describe("GET /api/products/:id", () => {
        test("should return product by id without auth", async () => {
            const res = await request(app).get(`/api/products/${testProductId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(testProductId);
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app).get(
                "/api/products/000000000000000000000000",
            );

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // 5. Update product endpoint tests
    describe("PUT /api/admin/products/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/products/update/${testProductId}`)
                .send({ name: "Updated Product" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update product successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/products/update/${testProductId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Test Product Updated", price: "750" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Test Product Updated");
            expect(res.body.data.price).toBe(750);
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app)
                .put("/api/admin/products/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Updated Product" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // 6. Delete product endpoint tests
    describe("DELETE /api/admin/products/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(
                `/api/admin/products/delete/${testProductId}`,
            );

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete product successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/products/delete/${testProductId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product deleted successfully");
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app)
                .delete("/api/admin/products/delete/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});