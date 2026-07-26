import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all reviews with pagination for admin dashboard
export const getAllReviews = async (params: {
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.REVIEWS.GET_ALL, {
            params,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch reviews",
        );
    }
};

// admin deletes a review by id
export const deleteReview = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.REVIEWS.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete review",
        );
    }
};