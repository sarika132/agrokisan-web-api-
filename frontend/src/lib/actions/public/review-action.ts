"use server";

import { getFeaturedReviews } from "@/lib/api/public/review";

// get featured reviews for homepage
export const handleGetFeaturedReviews = async (limit?: number) => {
    try {
        const result = await getFeaturedReviews(limit);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch featured reviews",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch featured reviews",
        };
    }
};