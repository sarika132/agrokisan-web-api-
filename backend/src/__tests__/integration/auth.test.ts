import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";

// Integration tests for the Auth API
// This describes test suite for the Auth API integration tests.
describe(
    'Auth API Integration Tests', // suite name
    () => { // function that contains the test cases for this suite
        const testUser = {
            fullName: "Test User",
            email: 'test@example.com',
            contactNumber: '1234567891',
            password: 'password123',
            confirmPassword: 'password123',
        };

        beforeAll(async () => {
            await UserModel.deleteOne({ email: testUser.email });
        });

        afterAll(async () => {
            await UserModel.deleteOne({ email: testUser.email });
        });

        // 1. Register endpoint tests here
        describe("POST /api/auth/register", () => {
            test("should validate missing fields", async () => {
                const res = await request(app).post("/api/auth/register").send({
                    fullName: testUser.fullName,
                    // missing email, password, contactNumber
                });

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
            });

            test("should register new user", async () => {
                const res = await request(app).post("/api/auth/register").send(testUser);

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.message).toBe("User registered successfully");
            });

            test("should return 400 if email already exists", async () => {
                const res = await request(app).post("/api/auth/register").send(testUser); // same email as above

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
                expect(res.body.message).toBe("Email already exists");
            });
        });

        // 2. Login endpoint tests here
        describe("POST /api/auth/login", () => {
            test("should login with valid credentials", async () => {
                const res = await request(app).post("/api/auth/login").send({
                    email: testUser.email,
                    password: testUser.password,
                });

                expect(res.statusCode).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.token).toBeDefined();
            });

            test("should fail with invalid email", async () => {
                const res = await request(app).post("/api/auth/login").send({
                    email: "wrong@example.com",
                    password: testUser.password,
                });

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
            });

            test("should fail with invalid password", async () => {
                const res = await request(app).post("/api/auth/login").send({
                    email: testUser.email,
                    password: "wrongpassword",
                });

                expect(res.statusCode).toBe(400);
                expect(res.body.success).toBe(false);
            });
        });
    });