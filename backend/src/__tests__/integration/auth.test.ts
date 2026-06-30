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

        // beforeAll and afterAll hooks to clean up the test user 
        // from the database
        // before Test Suite starts
        beforeAll(
            async () => {
                await UserModel.deleteOne({ email: testUser.email });
            }
        );
        // after Test Suite ends
        afterAll(
            async () => {
                await UserModel.deleteOne({ email: testUser.email });
            }
        );

        // 1. Group test cases for the /api/v1/auth/register endpoint
        describe(
            'POST /api/v1/auth/register', // group name
            () => {
                // In this same function, 
                // we can add more test cases for the 
                // /api/v1/auth/register endpoint
                // Test case for missing required fields
                test(
                    'should validate missing fields', // test case name
                    async () => { // test function
                        const res = await request(app)
                            .post('/api/v1/auth/register')
                            .send(
                                {
                                    fullName: testUser.fullName
                                }
                            );

                        // what client should expect when the request is invalid
                        expect(res.statusCode).toBe(400);
                        // the response body should indicate as success, false
                        expect(res.body.success).toBe(false);
                    }
                );

                // Test case for successful user registration
                test(
                    'should register new user',
                    async () => {
                        const res = await request(app)
                            .post('/api/v1/auth/register')
                            .send(testUser);

                        // can expect multiple things in the response when the request is successful
                        expect(res.statusCode).toBe(200);
                        expect(res.body.success).toBe(true);
                        expect(res.body.message).toBe('User created successfully');
                    }
                );
            }
        );
        // 2. Group test cases for the /api/v1/auth/login endpoint
        describe(
            'POST /api/v1/auth/login',
            () => {
                test(
                    'should login with valid credentials',
                    async () => {
                        const res = await request(app)
                            .post('/api/v1/auth/login')
                            .send(
                                {
                                    email: testUser.email,
                                    password: testUser.password,
                                }
                            );

                        expect(res.statusCode).toBe(200);
                        expect(res.body.success).toBe(true);
                        expect(res.body.data.token).toBeDefined();
                    }
                );

                test(
                    'should fail with invalid email',
                    async () => {
                        const res = await request(app)
                            .post('/api/v1/auth/login')
                            .send(
                                {
                                    email: 'wrong@example.com',
                                    password: testUser.password,
                                }
                            );

                        expect(res.statusCode).toBe(400);
                        expect(res.body.success).toBe(false);
                    }
                );
            }
        );
    }
);