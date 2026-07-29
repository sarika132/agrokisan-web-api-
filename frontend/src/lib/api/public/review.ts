import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get reviews for a product - public, no auth needed
export const getReviewsByProduct = async (productId: string) => {
    try {
        const response = await axiosInstance.get(
            API.landing.REVIEWS_BY_PRODUCT(productId)
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch reviews",
        );
    }
};

// get featured reviews for homepage - public, no auth needed
export const getFeaturedReviews = async (limit?: number) => {
    try {
        const response = await axiosInstance.get(API.landing.FEATURED_REVIEWS, {
            params: limit ? { limit } : {},
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch featured reviews",
        );
    }
};