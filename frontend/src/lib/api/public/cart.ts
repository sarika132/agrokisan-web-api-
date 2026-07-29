import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

export const addToCart = async (productId: string, quantity: number) => {
    try {
        const response = await axiosInstance.post(API.USER.CART.CREATE, {
            productId,
            quantity,
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to add to cart");
    }
};

export const getMyCart = async () => {
    try {
        const response = await axiosInstance.get(API.USER.CART.GET_MY_CART);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch cart");
    }
};

export const updateCartItem = async (id: string, quantity: number) => {
    try {
        const response = await axiosInstance.put(API.USER.CART.UPDATE(id), { quantity });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update cart");
    }
};

export const deleteCartItem = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.USER.CART.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to remove item");
    }
};