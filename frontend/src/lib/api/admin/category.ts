import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all categories for admin dashboard
export const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.CATEGORIES.GET_ALL);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch categories",
        );
    }
};

// admin creates a new category
export const createCategory = async (data: {
    name: string;
    description: string;
    collectionId: string; // category belongs to a collection
}) => {
    try {
        const response = await axiosInstance.post(
            API.ADMIN.CATEGORIES.CREATE,
            data,
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to create category",
        );
    }
};

// admin updates a category by id
export const updateCategory = async (
    id: string,
    data: { name?: string; description?: string; collectionId?: string },
) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.CATEGORIES.UPDATE(id),
            data,
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update category",
        );
    }
};

// admin deletes a category by id
export const deleteCategory = async (id: string) => {
    try {
        const response = await axiosInstance.delete(
            API.ADMIN.CATEGORIES.DELETE(id),
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete category",
        );
    }
};