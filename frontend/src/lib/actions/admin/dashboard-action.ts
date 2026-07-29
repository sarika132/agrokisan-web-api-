"use server";

import { getDashboardStats } from "@/lib/api/admin/dashboard";

// get all dashboard stats for admin dashboard page
export const handleGetDashboardStats = async () => {
    try {
        const result = await getDashboardStats();
        if (result.success) {
            return {
                success: true,
                message: result.message,
                data: result.data,
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch dashboard stats",
        };
    } catch (error: any) {
        return {
            success: false,
            message: error?.message || "Failed to fetch dashboard stats",
        };
    }
};