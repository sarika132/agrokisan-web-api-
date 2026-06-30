import { UserMongoRepository } from "../repositories/user.repository";
import { RegisterUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { IUser } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../configs/constant";
import { HttpException } from "../exceptions/http-exception";

const userRepository = new UserMongoRepository();

export class UserService {
    async registerUser(userData: RegisterUserDTO): Promise<IUser> {
        // check duplicate email
        const existingEmail = await userRepository.getUserByEmail(userData.email);
        if (existingEmail) {
            throw new HttpException(400, "Email already exists");
        }

        // hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const user = await userRepository.createUser(userData);
        return user;
    }

    async loginUser(loginData: LoginUserDTO) {
        const user = await userRepository.getUserByEmail(loginData.email);
        if (!user) {
            throw new HttpException(400, "Invalid email");
        }

        const isPasswordValid = await bcrypt.compare(
            loginData.password, // client password
            user.password, // database password
        );
        if (!isPasswordValid) {
            throw new HttpException(400, "Invalid password");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, // payload
            SECRET_KEY,
            { expiresIn: "30d" },
        );
        return { user, token };
    }

    async updateUser(id: string, userData: UpdateUserDTO): Promise<IUser> {
        const existingUser = await userRepository.getUserById(id);
        if (!existingUser) {
            throw new HttpException(404, "User not found");
        }
        if (userData.email && userData.email !== existingUser.email) {
            const existingEmail = await userRepository.getUserByEmail(userData.email);
            if (existingEmail) {
                throw new HttpException(400, "Email already exists");
            }
        }
        if (userData.password) {
            const currentPassword = (userData as any).currentPassword;
            if (!currentPassword) {
                throw new HttpException(400, "Current password is required to set a new password");
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isPasswordValid) {
                throw new HttpException(400, "Current password is incorrect");
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        }

        delete (userData as any).currentPassword;
        const updatedUser = await userRepository.update(id, userData);
        if (!updatedUser) {
            throw new HttpException(500, "Failed to update user");
        }
        return updatedUser;
    }
}