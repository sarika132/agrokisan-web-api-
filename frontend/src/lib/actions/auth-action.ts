"use server";

import { RegisterFormData, LoginFormData } from "@/app/(auth)/_schema/schema";
import { register, login, whoami, updateProfile } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";
import { revalidatePath } from "next/cache";

// REGISTER
export const handleRegisterUser = async (data: RegisterFormData) => {
    try {
        const result = await register(data);
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return {
                success: false,
                message: result.message || "Registration failed",
            };
        }
    } catch (error: Error | any) {
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
        } else {
            return { success: false, message: result.message || "Login failed" };
        }
    } catch (error: Error | any) {
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
        } else {
            return {
                success: false, message: result.message || "Update user failed"
            };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Update user failed" };
    }
}

// WHOAMI
export const handleUserDetails = async () => {
    try {
        const result = await whoami();
        if (result.success) {
            return { success: true, message: result.message, data: result.data };
        } else {
            return {
                success: false, message: result.message || "Get user details failed"
            };
        }
    } catch (error: Error | any) {
        return { success: false, message: error?.message || "Get user details failed" };
    }
}
