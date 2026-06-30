import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

//pagination 
export const getAllUsers = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.USERS.GET_ALL, {
            params,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch users");
    }
};

// get user by id
export const getUserById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.USERS.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch user");
    }
};

// admin creates a new user 
export const createUser = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.USERS.CREATE, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to create user");
    }
};

// admin delete user by id
export const deleteUser = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.USERS.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to delete user");
    }
};

// admin updates a user profile 
export const updateUser = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.USERS.UPDATE(id), data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to update user");
    }
};

// admin updates user password
export const updateUserPassword = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.USERS.UPDATE_PASSWORD(id),
            data,
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update user password",
        );
    }
};

