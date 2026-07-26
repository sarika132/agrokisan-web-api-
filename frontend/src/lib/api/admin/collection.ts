import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all collections with pagination and optional search for admin dashboard
export const getAllCollections = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.COLLECTIONS.GET_ALL, {
            params,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch collections");
    }
};

// admin creates a new collection
export const createCollection = async (data: {
    name: string;
    description: string;
}) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.COLLECTIONS.CREATE, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to create collection");
    }
};

// admin updates a collection
export const updateCollection = async (
    id: string,
    data: { name?: string; description?: string }
) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.COLLECTIONS.UPDATE(id),
            data
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to update collection");
    }
};

// admin deletes a collection by id
export const deleteCollection = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.COLLECTIONS.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || "Failed to delete collection");
    }
};