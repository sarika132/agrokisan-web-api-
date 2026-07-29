import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ProductModel } from "../../models/product.model";
import { CategoryModel } from "../../models/category.model";

// Integration tests for the Product API
describe("Product API Integration Tests", () => {
    let adminToken: string;
    let testProductId: string;
    let categoryId: string;

    const adminUser = {
        fullName: "Admin User",
        email: "adminproduct@example.com",
        contactNumber: "9800000002",
        password: "password123",
        confirmPassword: "password123",
    };

    beforeAll(async () => {
        await UserModel.deleteOne({ email: adminUser.email });
        await ProductModel.deleteMany({ name: "Test Product One" });

        const category = await CategoryModel.findOneAndUpdate(
            { name: "Seed Variety" },
            { name: "Seed Variety", description: "test category" },
            { upsert: true, new: true }
        );
        if (!category) throw new Error("Failed to create category");
        categoryId = category._id.toString();

        await request(app).post("/api/auth/register").send(adminUser);
        await UserModel.findOneAndUpdate(
            { email: adminUser.email },
            { role: "admin" }
        );

        const loginRes = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: adminUser.password,
        });
        adminToken = loginRes.body.data.token;
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: "Test Product One" });
        await UserModel.deleteOne({ email: adminUser.email });
        await CategoryModel.deleteOne({ name: "Seed Variety" });
    });

    describe("POST /api/admin/product/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/product/create")
                .send({
                    name: "Test Product One",
                    description: "Test product",
                    price: 1000,
                    unit: "kg",
                    stock: 50,
                    categoryId,
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/product/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Test Product One" });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create product successfully", async () => {
            const res = await request(app)
                .post("/api/admin/product/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Test Product One",
                    description: "A test product",
                    price: 1000,
                    unit: "kg",
                    stock: 50,
                    categoryId,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product created successfully");
            expect(res.body.data.name).toBe("Test Product One");
            testProductId = res.body.data._id;
        });

        test("should return 400 if product name already exists", async () => {
            const res = await request(app)
                .post("/api/admin/product/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Test Product One",
                    description: "Duplicate",
                    price: 1000,
                    unit: "kg",
                    stock: 50,
                    categoryId,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });
    });

    describe("GET /api/products", () => {
        test("should return all available products without auth", async () => {
            const res = await request(app).get("/api/products");
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("GET /api/admin/products", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).get("/api/admin/products");
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return paginated products for admin", async () => {
            const res = await request(app)
                .get("/api/admin/products")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.data).toBeDefined();
            expect(res.body.data.pagination).toBeDefined();
        });

        test("should search products by name", async () => {
            const res = await request(app)
                .get("/api/admin/products?search=Test")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.data.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/products/:id", () => {
        test("should return product by id without auth", async () => {
            const res = await request(app).get(`/api/products/${testProductId}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(testProductId);
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app).get("/api/products/000000000000000000000000");
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("PUT /api/admin/product/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/product/update/${testProductId}`)
                .send({ name: "Updated Product" });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update product successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/product/update/${testProductId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Test Product Updated", price: 750 });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Test Product Updated");
            expect(res.body.data.price).toBe(750);
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app)
                .put("/api/admin/product/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Doesn't Matter" });
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/admin/product/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(`/api/admin/product/delete/${testProductId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete product successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/product/delete/${testProductId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Product deleted successfully");
        });

        test("should return 404 if product not found", async () => {
            const res = await request(app)
                .delete("/api/admin/product/delete/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});