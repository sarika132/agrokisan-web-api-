import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all dashboard stats for admin dashboard page
export const getDashboardStats = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN.DASHBOARD.STATS);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch dashboard stats",
        );
    }
};