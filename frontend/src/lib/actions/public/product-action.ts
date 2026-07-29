"use server";

import {
    getPublicProducts,
    getPublicProductById,
} from "@/lib/api/public/products";

export const handleGetPublicProducts = async () => {
    try {
        const result = await getPublicProducts();
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch products",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch products",
        };
    }
};

export const handleGetPublicProductById = async (id: string) => {
    try {
        const result = await getPublicProductById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch product",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch product",
        };
    }
};