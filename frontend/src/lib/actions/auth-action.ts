"use server";

import { RegisterFormData, LoginFormData } from "@/app/(auth)/_schema/schema";
import { register, login, whoami, updateProfile, requestPasswordReset, resetPassword } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";
import { revalidatePath } from "next/cache";
import { changePassword } from "../api/auth";

// REGISTER
export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        const result = await register(data);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Registration failed" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Registration failed" };
    }
};

// LOGIN
export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        const user = result.data.user;
        const token = result.data.token;
        await setTokenCookie(token);
        await storeUserData(user);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Login failed" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Login failed" };
    }
};

// UPDATE PROFILE
export const handleUpdateProfile = async (data: FormData) => {
    try {
        const result = await updateProfile(data);
        if (result.success) {
            await storeUserData(result.data);
            revalidatePath("/profile");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Update user failed" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Update user failed" };
    }
};

// WHOAMI
export const handleUserDetails = async () => {
    try {
        const result = await whoami();
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Get user details failed" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Get user details failed" };
    }
};

// REQUEST PASSWORD RESET
export const handleRequestPasswordReset = async (email: string) => {
    try {
        const result = await requestPasswordReset(email);
        if (result.success) {
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to request password reset" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to request password reset" };
    }
};

// RESET PASSWORD (with token)
export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        if (result.success) {
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to reset password" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to reset password" };
    }
};

//CHANGE PASSWORD (for logged‑in users)

export const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    try {
        const result = await changePassword(data);
        if (result.success) {
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to change password" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to change password" };
    }
};
