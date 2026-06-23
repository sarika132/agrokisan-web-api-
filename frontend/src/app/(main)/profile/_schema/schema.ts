import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

// profile update schema - password and role excluded intentionally 
export const updateProfileSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .regex(/^[0-9]+$/, "Contact number must contain only digits"),
    image: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
            message: "Max file size is 5MB",
        })
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
            message: "Only .jpg and .png formats are supported",
        }),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// password change schema
export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;