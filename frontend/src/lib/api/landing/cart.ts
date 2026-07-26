import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// add item to cart - user must be logged in
export const addToCart = async (data: {
    productId: string;
    quantity: number;
}) => {
    try {
        const response = await axiosInstance.post(API.USER.CART.CREATE, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to add item to cart",
        );
    }
};

// get all cart items for logged in user
export const getMyCart = async () => {
    try {
        const response = await axiosInstance.get(API.USER.CART.GET_MY_CART);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch cart items",
        );
    }
};

// get single cart item by id
export const getCartItemById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.USER.CART.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch cart item",
        );
    }
};

// cancel a cart item
export const cancelCartItem = async (id: string) => {
    try {
        const response = await axiosInstance.put(API.USER.CART.CANCEL(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to cancel cart item",
        );
    }
};

// update cart item quantity
export const updateCartItem = async (id: string, quantity: number) => {
    try {
        const response = await axiosInstance.put(API.USER.CART.UPDATE(id), {
            quantity,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update cart item",
        );
    }
};

// delete cart item (remove from cart)
export const deleteCartItem = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.USER.CART.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to remove item from cart",
        );
    }
};