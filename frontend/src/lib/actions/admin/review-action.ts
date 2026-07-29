"use server";

import { revalidatePath } from "next/cache";
import { getAllReviews, deleteReview } from "@/lib/api/admin/review";

// get all reviews with pagination for admin dashboard
export const handleGetAllReviews = async ({
    page,
    limit,
}: {
    page?: number;
    limit?: number;
}) => {
    try {
        const currentPage = page && page > 0 ? page : 1;
        const currentLimit = limit && limit > 0 ? limit : 10;

        const result = await getAllReviews({
            page: currentPage,
            limit: currentLimit,
        });

        if (result.success) {
            return {
                success: true,
                message: result.message,
                data: result.data.data,
                pagination: result.data.pagination,
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch reviews",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch reviews",
        };
    }
};

// admin deletes a review - revalidates list page after deletion
export const handleDeleteReview = async (id: string) => {
    try {
        const result = await deleteReview(id);
        if (result.success) {
            revalidatePath("/dashboard/reviews"); // refresh review list after deletion
            return { success: true, message: result.message };
        }
        return {
            success: false,
            message: result.message || "Failed to delete review",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to delete review",
        };
    }
};