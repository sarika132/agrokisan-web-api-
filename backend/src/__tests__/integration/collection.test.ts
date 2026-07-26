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

    // runs once before all tests
    beforeAll(async () => {
        // clean up any leftover test data
        await UserModel.deleteOne({ email: adminUser.email });
        await CollectionModel.deleteOne({ name: "Tools" });

        // register and login
        await request(app).post("/api/auth/register").send(adminUser);

        // set role to admin directly in DB
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
        await CollectionModel.deleteOne({ name: "Tools" });
        await UserModel.deleteOne({ email: adminUser.email });
    });

    // 1. Get all collections (public) endpoint tests
    describe("GET /api/collections", () => {
        test("should return all collections without auth", async () => {
            const res = await request(app).get("/api/collections");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    // 2. Create collection endpoint tests
    describe("POST /api/admin/collections/create", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .post("/api/admin/collections/create")
                .send({
                    name: "Agriculture Tools",
                    description: "All agriculture tools",
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should validate missing fields", async () => {
            const res = await request(app)
                .post("/api/admin/collections/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    // missing description
                    name: "Agriculture Tools",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should validate invalid collection name", async () => {
            const res = await request(app)
                .post("/api/admin/collections/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Invalid Collection Name", // not in enum
                    description: "Some description",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test("should create collection successfully", async () => {
            const res = await request(app)
                .post("/api/admin/collections/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Tools",
                    description: "All agriculture hand tools for farming",
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Collection created successfully");
            expect(res.body.data.name).toBe("Agriculture Tools");

            // save collection id for later tests
            testCollectionId = res.body.data._id;
        });

        test("should return 400 if collection name already exists", async () => {
            const res = await request(app)
                .post("/api/admin/collections/create")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    name: "Agriculture Tools", // same name as above
                    description: "Duplicate collection",
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe(
                `Collection "Agriculture Tools" already exists`,
            );
        });
    });

    // 3. Update collection endpoint tests
    describe("PUT /api/admin/collections/update/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app)
                .put(`/api/admin/collections/update/${testCollectionId}`)
                .send({ description: "Updated description" });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should update collection successfully", async () => {
            const res = await request(app)
                .put(`/api/admin/collections/update/${testCollectionId}`)
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated agriculture tools description" });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.description).toBe(
                "Updated agriculture tools description",
            );
        });

        test("should return 404 if collection not found", async () => {
            const res = await request(app)
                .put("/api/admin/collections/update/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ description: "Updated description" });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    // 4. Delete collection endpoint tests
    describe("DELETE /api/admin/collections/delete/:id", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).delete(
                `/api/admin/collections/delete/${testCollectionId}`,
            );

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should delete collection successfully", async () => {
            const res = await request(app)
                .delete(`/api/admin/collections/delete/${testCollectionId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Collection deleted successfully");
        });

        test("should return 404 if collection not found", async () => {
            const res = await request(app)
                .delete(
                    "/api/admin/collections/delete/000000000000000000000000",
                )
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });
});