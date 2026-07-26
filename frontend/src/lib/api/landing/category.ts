import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// fetch all categories for dropdowns - used in product form
export const getPublicCategories = async () => {
    try {
        const response = await axiosInstance.get(API.landing.CATEGORIES);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch categories",
        );
    }
};