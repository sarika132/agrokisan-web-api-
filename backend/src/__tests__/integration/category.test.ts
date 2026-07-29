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

    beforeAll(async () => {
        await UserModel.deleteOne({ email: adminUser.email });
        await CategoryModel.deleteOne({ name: "Agriculture Equipment" });

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
        await CategoryModel.deleteOne({ name: "Agriculture Equipment" });
        await UserModel.deleteOne({ email: adminUser.email });
    });

    describe("GET /api/categories", () => {
        test("should return all categories without auth", async () => {
            const res = await request(app).get("/api/categories");
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("POST /api/admin/category/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/category/create")
                .send({
                    name: "Agriculture Equipment",
                    description: "All agriculture equipment",
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/category/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Agriculture Equipment" });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should validate invalid category name", async () => {
            const res = await request(app)
                .post("/api/admin/category/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "InvalidCategory",
                    description: "Some description",
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create category successfully", async () => {
            const res = await request(app)
                .post("/api/admin/category/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Equipment",
                    description: "Heavy agriculture equipment for farming",
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category created successfully");
            expect(res.body.data.name).toBe("Agriculture Equipment");
            testCategoryId = res.body.data._id;
        });

        test("should return 400 if category name already exists", async () => {
            const res = await request(app)
                .post("/api/admin/category/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Equipment",
                    description: "Duplicate category",
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(`Category "Agriculture Equipment" already exists`);
        });
    });

    describe("PUT /api/admin/category/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/category/update/${testCategoryId}`)
                .send({ description: "Updated description" });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update category successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/category/update/${testCategoryId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated agriculture equipment description" });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.description).toBe("Updated agriculture equipment description");
        });

        test("should return 404 if category not found", async () => {
            const res = await request(app)
                .put("/api/admin/category/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated description" });
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/admin/category/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(`/api/admin/category/delete/${testCategoryId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete category successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/category/delete/${testCategoryId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Category deleted successfully");
        });

        test("should return 404 if category not found", async () => {
            const res = await request(app)
                .delete("/api/admin/category/delete/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});