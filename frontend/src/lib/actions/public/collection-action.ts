"use server";

import { getPublicCollections } from "@/lib/api/public/collection";

// fetch all collections for dropdowns in products form
export const handleGetPublicCollections = async () => {
    try {
        const result = await getPublicCollections();
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch collections",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch collections",
        };
    }
};