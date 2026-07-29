"use server";

import { revalidatePath } from "next/cache";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/api/admin/category";

export const handleGetAllCategories = async ({
    page,
    limit,
    search,
}: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const currentPage = page || 1;
        const currentLimit = limit || 10;
        const currentSearch = search || "";

        const result = await getAllCategories({
            page: currentPage,
            limit: currentLimit,
            search: currentSearch,
        });

        if (result.success) {
            return {
                success: true,
                data: result.data?.data ?? [],
                pagination: result.data?.pagination ?? {
                    page: currentPage,
                    limit: currentLimit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }
        return { success: false, message: result.message || "Failed to fetch categories" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch categories" };
    }
};

export const handleCreateCategory = async (data: FormData) => {
    try {
        const result = await createCategory(data);
        if (result.success) {
            revalidatePath("/dashboard/categories");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Category creation failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Category creation failed" };
    }
};

export const handleUpdateCategory = async (id: string, data: FormData) => {
    try {
        const result = await updateCategory(id, data);
        if (result.success) {
            revalidatePath("/dashboard/categories");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update category" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update category" };
    }
};

export const handleDeleteCategory = async (id: string) => {
    try {
        const result = await deleteCategory(id);
        if (result.success) {
            revalidatePath("/dashboard/categories");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to delete category" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete category" };
    }
};