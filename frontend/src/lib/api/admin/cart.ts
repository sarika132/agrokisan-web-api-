import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all cart items with pagination for admin dashboard
export const getAllCartItems = async (params: {
    page?: number;
    limit?: number;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.CART.GET_ALL, {
            params,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch cart items",
        );
    }
};

// get a single cart item by id for admin detail page
export const getCartItemById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.CART.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch cart item",
        );
    }
};

// admin cancels a cart item (sets status to cancelled)
export const cancelCartItem = async (id: string) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.CART.CANCEL(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to cancel cart item",
        );
    }
};

// admin deletes a cart item (hard delete)
export const deleteCartItem = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.CART.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete cart item",
        );
    }
};