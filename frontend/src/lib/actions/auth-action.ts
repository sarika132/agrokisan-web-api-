"use server";

import { RegisterFormData, LoginFormData } from "@/app/(auth)/_schema/schema";
import { register, login } from "../api/auth";
import { setTokenCookie, storeUserData } from "../cookies";

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