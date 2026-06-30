import { UserMongoRepository } from "../../../repositories/user.repository";
import { UserModel } from "../../../models/user.model";

describe("Unit: UserMongoRepository", () => {
    let userRepository = new UserMongoRepository();
    beforeAll(async () => {
        await UserModel.deleteMany({});
    });

    const userData = {
        fullName: "Test User",
        email: "test@example.com",
        contactNumber: "1234567891",
        password: "password123",
        role: "user" as const,
    };

    test("should create a user", async () => {
        const user = await userRepository.createUser(userData);
        expect(user).toBeDefined();
        expect(user).toHaveProperty("_id");
        expect(user.fullName).toBe(userData.fullName);
        expect(user.email).toBe(userData.email);
    });

    test("should find user by email", async () => {
        const user = await userRepository.getUserByEmail(userData.email);
        expect(user).toBeDefined();
        expect(user?.email).toBe(userData.email);
    });

    test("should return null for non-existing email", async () => {
        const user = await userRepository.getUserByEmail("notexist@example.com");
        expect(user).toBeNull();
    });

    test("should find user by id", async () => {
        const existing = await userRepository.getUserByEmail(userData.email);
        const user = await userRepository.getUserById(existing!._id.toString());
        expect(user).toBeDefined();
        expect(user?.email).toBe(userData.email);
    });

    test("should update a user", async () => {
        const existing = await userRepository.getUserByEmail(userData.email);
        const updated = await userRepository.update(existing!._id.toString(), {
            fullName: "Updated Name",
        });
        expect(updated?.fullName).toBe("Updated Name");
    });

    test("should delete a user", async () => {
        const existing = await userRepository.getUserByEmail(userData.email);
        const deleted = await userRepository.delete(existing!._id.toString());
        expect(deleted).toBe(true);
    });
});