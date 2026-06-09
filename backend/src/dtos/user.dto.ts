import { z } from "zod";
import { UserSchema } from "../types/user.type";

// Create a DTO for registering a user
export const RegisterUserDTO = UserSchema.pick({
    fullName: true,
    email: true,
    contactNumber: true,
    password: true,
    role: true,
});
export type RegisterUserDTO = z.infer<typeof RegisterUserDTO>;

// Login DTO - reuse existing schema
export const LoginUserDTO = UserSchema.pick({
    email: true,
    password: true,
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;