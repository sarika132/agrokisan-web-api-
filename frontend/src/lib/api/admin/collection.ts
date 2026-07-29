import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

export const getAllCollections = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.COLLECTIONS.GET_ALL, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch collections");
    }
};

export const createCollection = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.COLLECTIONS.CREATE, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to create collection");
    }
};

export const updateCollection = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.COLLECTIONS.UPDATE(id), data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update collection");
    }
};

export const deleteCollection = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.COLLECTIONS.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete collection");
    }
};