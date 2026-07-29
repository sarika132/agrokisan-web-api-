import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { CollectionModel } from "../../models/collection.model";

// Integration tests for the Collection API
describe("Collection API Integration Tests", () => {
    let adminToken: string;
    let testCollectionId: string;

    const adminUser = {
        fullName: "Admin Collection User",
        email: "admincollection@example.com",
        contactNumber: "9800000004",
        password: "password123",
        confirmPassword: "password123",
    };

    beforeAll(async () => {
        await UserModel.deleteOne({ email: adminUser.email });
        await CollectionModel.deleteOne({ name: "Tools" });

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
        await CollectionModel.deleteOne({ name: "Tools" });
        await UserModel.deleteOne({ email: adminUser.email });
    });

    describe("GET /api/collections", () => {
        test("should return all collections without auth", async () => {
            const res = await request(app).get("/api/collections");
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe("POST /api/admin/collection/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/collection/create")
                .send({
                    name: "Tools",
                    description: "All agriculture tools",
                });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/collection/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ name: "Tools" });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should validate invalid collection name", async () => {
            const res = await request(app)
                .post("/api/admin/collection/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "InvalidCollection",
                    description: "Some description",
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create collection successfully", async () => {
            const res = await request(app)
                .post("/api/admin/collection/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Tools",
                    description: "All agriculture hand tools for farming",
                });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Collection created successfully");
            expect(res.body.data.name).toBe("Tools");
            testCollectionId = res.body.data._id;
        });

        test("should return 400 if collection name already exists", async () => {
            const res = await request(app)
                .post("/api/admin/collection/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Tools",
                    description: "Duplicate collection",
                });
            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(`Collection "Tools" already exists`);
        });
    });

    describe("PUT /api/admin/collection/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/collection/update/${testCollectionId}`)
                .send({ description: "Updated description" });
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update collection successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/collection/update/${testCollectionId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated tools description" });
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.description).toBe("Updated tools description");
        });

        test("should return 404 if collection not found", async () => {
            const res = await request(app)
                .put("/api/admin/collection/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated description" });
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe("DELETE /api/admin/collection/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(`/api/admin/collection/delete/${testCollectionId}`);
            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete collection successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/collection/delete/${testCollectionId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Collection deleted successfully");
        });

        test("should return 404 if collection not found", async () => {
            const res = await request(app)
                .delete("/api/admin/collection/delete/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});