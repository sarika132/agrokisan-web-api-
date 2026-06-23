import { z } from "zod";

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 character"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


// Register schema (AgroKisan)
export const registerSchema = z
    .object({
        fullName: z.string().min(1, "Full name is required"),

        contactNumber: z
            .string()
            .min(10, "Contact number must be at least 10 digits")
            .max(11, "Contact number is too long"),

        email: z.string().email("Invalid email address"),

        password: z.string().min(6, "Password must be at least 6 characters"),

        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;