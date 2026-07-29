import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Registration failed");
    }
};

export const login = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Login failed");
    }
};

// WHOAMI
export const whoami = async () => {
    try {
        const response = await axiosInstance.get(API.AUTH.WHOAMI);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch user details",
        );
    }
};

// update profile 
export const updateProfile = async (data: any) => {
    try {
        const response = await axiosInstance.put(API.AUTH.UPDATE, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update profile",
        );
    }
};

// request password reset email
export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REQUEST_PASSWORD_RESET, {
            email,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to request password reset",
        );
    }
};

// reset password using token from email link
export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosInstance.post(API.AUTH.RESET_PASSWORD(token), {
            newPassword,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to reset password",
        );
    }
};

export const changePassword = async (data: {
    currentPassword: string;
    newPassword: string;
}) => {
    try {
        const response = await axiosInstance.put(API.AUTH.CHANGE_PASSWORD, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to change password");
    }
};