import { z } from "zod";

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 character"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

//Register schema (AgroKisan)
export const registerSchema = z
    .object({
        fullName: z.string().min(1, "Full name is required"),
        email: z.string().email("Invalid email address"),
        contactNumber: z
            .string()
            .min(10, "Contact number must be at least 10 digits"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type RegisterFormData = z.infer<typeof registerSchema>;

// forgot password schema - just needs a valid email
export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// reset password schema - new password + confirmation
export const resetPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;