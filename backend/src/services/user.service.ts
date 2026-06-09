import { UserMongoRepository } from "../repositories/user.repository";
import { RegisterUserDTO, LoginUserDTO } from "../dtos/user.dto";
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
}