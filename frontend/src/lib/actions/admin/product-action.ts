"use server";

import { revalidatePath } from "next/cache";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "@/lib/api/admin/product";

// get all products with pagination and search for admin dashboard
export const handleGetAllProducts = async ({
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

        const result = await getAllProducts({
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
        return { success: false, message: result.message || "Failed to fetch products" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch products" };
    }
};

export const handleGetProductById = async (id: string) => {
    try {
        const result = await getProductById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch product" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch product" };
    }
};

export const handleCreateProduct = async (data: FormData) => {
    try {
        const result = await createProduct(data);
        if (result.success) {
            revalidatePath("/dashboard/products");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Product creation failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Product creation failed" };
    }
};

export const handleUpdateProduct = async (id: string, data: FormData) => {
    try {
        const result = await updateProduct(id, data);
        if (result.success) {
            revalidatePath("/dashboard/products");
            revalidatePath(`/dashboard/products/${id}`);
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Product update failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Product update failed" };
    }
};

export const handleDeleteProduct = async (id: string) => {
    try {
        const result = await deleteProduct(id);
        if (result.success) {
            revalidatePath("/dashboard/products");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Product deletion failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Product deletion failed" };
    }
};