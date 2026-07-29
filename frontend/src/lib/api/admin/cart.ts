import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

// Get all cart items with pagination, search, and status filter
export const getAllCarts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.CART.GET_ALL, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch carts");
  }
};

// Get a single cart item by ID
export const getCartById = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.CART.GET_BY_ID(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch cart item");
  }
};

// Get cart items for a specific customer
export const getCartByCustomerId = async (customerId: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.CART.GET_BY_CUSTOMER(customerId));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user's cart");
  }
};

// Update cart status
export const updateCartStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.CART.UPDATE_STATUS(id), { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update cart status");
  }
};

// Delete a cart item
export const deleteCartItem = async (id: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.CART.DELETE(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete cart item");
  }
};