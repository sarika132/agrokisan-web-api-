import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CategoryModel } from "../../models/category.model";

// Integration tests for the Category API
describe("Category API Integration Tests", () => {
    let adminToken: string;
    let testCategoryId: string;

    const adminUser = {
        fullName: "Admin Category User",
        email: "admincategory@example.com",
        contactNumber: "9800000005",
        password: "password123",
        confirmPassword: "password123",
    };

    // runs once before all tests
    beforeAll(async () => {
        // clean up any leftover test data
        await UserModel.deleteOne({ email: adminUser.email });
        await CategoryModel.deleteOne({ name: "Agriculture Equipment" });

        // register and set role to admin
        await request(app).post("/api/auth/register").send(adminUser);
        await UserModel.findOneAndUpdate(
            { email: adminUser.email },
            { role: "admin" },
        );

        // login to get admin token
        const loginRes = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: adminUser.password,
        });
        adminToken = loginRes.body.data.token;
    });

    // runs once after all tests
    afterAll(async () => {
        await CategoryModel.deleteOne({ name: "Agriculture Equipment" });
        await UserModel.deleteOne({ email: adminUser.email });
    });

    // 1. Get all categories (public) endpoint tests
    describe("GET /api/categories", () => {
        test("should return all categories without auth", async () => {
            const res = await request(app).get("/api/categories");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // 2. Create category endpoint tests
    describe("POST /api/admin/categories/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/categories/create")
                .send({
                    name: "Agriculture Equipment",
                    description: "All agriculture equipment",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/categories/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    // missing description
                    name: "Agriculture Equipment",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should validate invalid category name", async () => {
            const res = await request(app)
                .post("/api/admin/categories/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Invalid Category", // not in enum
                    description: "Some description",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create category successfully", async () => {
            const res = await request(app)
                .post("/api/admin/categories/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Equipment",
                    description: "Heavy agriculture equipment for farming",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");
            expect(res.body.data.name).toBe("Agriculture Equipment");

            // save category id for later tests
            testCategoryId = res.body.data._id;
        });

        test("should return 400 if category name already exists", async () => {
            const res = await request(app)
                .post("/api/admin/categories/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Equipment", // same name as above
                    description: "Duplicate category",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(
                `Category "Agriculture Equipment" already exists`,
            );
        });
    });

    // 3. Update category endpoint tests
    describe("PUT /api/admin/categories/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/categories/update/${testCategoryId}`)
                .send({ description: "Updated description" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update category successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/categories/update/${testCategoryId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated agriculture equipment description" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.description).toBe(
                "Updated agriculture equipment description",
            );
        });

        test("should return 404 if category not found", async () => {
            const res = await request(app)
                .put("/api/admin/categories/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated description" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // 4. Delete category endpoint tests
    describe("DELETE /api/admin/categories/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(
                `/api/admin/categories/delete/${testCategoryId}`,
            );

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete category successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/categories/delete/${testCategoryId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category deleted successfully");
        });

        test("should return 404 if category not found", async () => {
            const res = await request(app)
                .delete(
                    "/api/admin/categories/delete/000000000000000000000000",
                )
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});