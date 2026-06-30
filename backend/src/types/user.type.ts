import { z } from "zod";

export const UserSchema = z.object({
    // fullname
    fullName: z.string().min(1, "Full name is required"),
    //email
    email: z.string().email("Invalid email address"),
    // contact number
    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .regex(/^[0-9]+$/, "Contact number must contain only digits"),
    // password
    password: z.string().min(6, "Password must be at least 6 characters long"),
    // role
    role: z.enum(["admin", "user"]).default("user"),
    profileImage: z.string().optional()
});

export type UserType = z.infer<typeof UserSchema>;





