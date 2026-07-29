"use server";

import { getPublicCategories } from "@/lib/api/public/category";

export const handleGetPublicCategories = async () => {
    try {
        const result = await getPublicCategories();
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch categories" };
    } catch (error: any) {
        console.error("Category fetch error:", error);
        return { success: false, message: error.message || "Failed to fetch categories" };
    }
};