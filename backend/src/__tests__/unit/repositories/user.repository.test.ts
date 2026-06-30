import { UserMongoRepository } from "../../../repositories/user.repository";

describe('UserMongoRepository', () => {
    const userRepository = new UserMongoRepository();
    const userData: any = {
        email: 'test@example.com',
        fullName: 'Test User',
        password: 'password123',
        contactNumber: '1234567891',


    };
    test('should create a new user', async () => {
        const user = await userRepository.createUser(userData);

        expect(user).toBeDefined();
        expect(user.contactNumber).toBe(userData.contactnumber);
        expect(user.email).toBe(userData.email);
    });
});