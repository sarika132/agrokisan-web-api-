// lib/api/admin/category.ts
import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

export const getAllCategories = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.CATEGORIES.GET_ALL, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch categories");
    }
};

export const createCategory = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.CATEGORIES.CREATE, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to create category");
    }
};

export const updateCategory = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.CATEGORIES.UPDATE(id), data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update category");
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.CATEGORIES.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete category");
    }
};