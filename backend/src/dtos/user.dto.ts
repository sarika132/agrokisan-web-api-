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

// User update DTO - reuse existing schema and make all fields optional
export const UpdateUserDTO = UserSchema.partial().extend({
    currentPassword: z.string().optional(),
});
export type UpdateUserDTO = z.infer<typeof UpdateUserDTO>;

// Password update DTO - used by admin to update a specific user's password
export const UpdatePasswordDTO = z
    .object({
        currentPassword: z
            .string()
            .min(6, "Current password must be at least 6 characters long"),
        newPassword: z
            .string()
            .min(6, "New password must be at least 6 characters long"),
        confirmPassword: z
            .string()
            .min(6, "Confirm password must be at least 6 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "New password and confirm password must match",
        path: ["confirmPassword"],
    });
export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTO>;

// Admin Create User DTO - includes role so admin can assign role when creating
export const CreateUserDTOAdmin = UserSchema.pick({
    fullName: true,
    email: true,
    contactNumber: true,
    password: true,
    role: true,
});
export type CreateUserDTOAdmin = z.infer<typeof CreateUserDTOAdmin>;