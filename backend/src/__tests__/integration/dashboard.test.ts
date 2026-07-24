import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

// Integration tests for the Dashboard API
describe("Dashboard API Integration Tests", () => {
    let adminToken: string;
    let regularToken: string;

    const adminUser = {
        fullName: "Admin Dashboard User",
        email: "admindashboard@example.com",
        contactNumber: "9800000006",
        password: "password123",
        confirmPassword: "password123",
    };

    const regularUser = {
        fullName: "Regular Dashboard User",
        email: "regulardashboard@example.com",
        contactNumber: "9800000007",
        password: "password123",
        confirmPassword: "password123",
    };

    // runs once before all tests
    beforeAll(async () => {
        // clean up any leftover test data
        await UserModel.deleteOne({ email: adminUser.email });
        await UserModel.deleteOne({ email: regularUser.email });

        // register both users
        await request(app).post("/api/auth/register").send(adminUser);
        await request(app).post("/api/auth/register").send(regularUser);

        // set admin role directly in DB
        await UserModel.findOneAndUpdate(
            { email: adminUser.email },
            { role: "admin" },
        );

        // login admin
        const adminLoginRes = await request(app).post("/api/auth/login").send({
            email: adminUser.email,
            password: adminUser.password,
        });
        adminToken = adminLoginRes.body.data.token;

        // login regular user
        const regularLoginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: regularUser.email,
                password: regularUser.password,
            });
        regularToken = regularLoginRes.body.data.token;
    });

    // runs once after all tests
    afterAll(async () => {
        await UserModel.deleteOne({ email: adminUser.email });
        await UserModel.deleteOne({ email: regularUser.email });
    });

    // 1. Get dashboard stats endpoint tests
    describe("GET /api/admin/dashboard/stats", () => {
        test("should return 401 if not logged in", async () => {
            const res = await request(app).get("/api/admin/dashboard/stats");

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        test("should return 403 if not admin", async () => {
            const res = await request(app)
                .get("/api/admin/dashboard/stats")
                .set("Authorization", `Bearer ${regularToken}`);

            expect(res.statusCode).toBe(403);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Forbidden not admin");
        });

        test("should return dashboard stats for admin", async () => {
            const res = await request(app)
                .get("/api/admin/dashboard/stats")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Dashboard stats fetched successfully");
        });

        test("should return correct stat fields", async () => {
            const res = await request(app)
                .get("/api/admin/dashboard/stats")
                .set("Authorization", `Bearer ${adminToken}`);

            const stats = res.body.data;

            // product stats
            expect(stats).toHaveProperty("totalProducts");
            expect(stats).toHaveProperty("availableProducts");

            // customer stats
            expect(stats).toHaveProperty("totalCustomers");

            // cart stats
            expect(stats).toHaveProperty("totalCartItems");
            expect(stats).toHaveProperty("activeCartItems");
            expect(stats).toHaveProperty("checkedoutCartItems");
            expect(stats).toHaveProperty("cancelledCartItems");

            // revenue
            expect(stats).toHaveProperty("totalRevenue");

            // review and collection stats
            expect(stats).toHaveProperty("totalReviews");
            expect(stats).toHaveProperty("totalCollections");

            // recent data arrays
            expect(stats).toHaveProperty("recentCartItems");
            expect(stats).toHaveProperty("recentCustomers");
            expect(Array.isArray(stats.recentCartItems)).toBe(true);
            expect(Array.isArray(stats.recentCustomers)).toBe(true);
        });

        test("should return numeric values for all count fields", async () => {
            const res = await request(app)
                .get("/api/admin/dashboard/stats")
                .set("Authorization", `Bearer ${adminToken}`);

            const stats = res.body.data;

            expect(typeof stats.totalProducts).toBe("number");
            expect(typeof stats.availableProducts).toBe("number");
            expect(typeof stats.totalCustomers).toBe("number");
            expect(typeof stats.totalCartItems).toBe("number");
            expect(typeof stats.totalRevenue).toBe("number");
            expect(typeof stats.totalReviews).toBe("number");
            expect(typeof stats.totalCollections).toBe("number");
        });
    });
});