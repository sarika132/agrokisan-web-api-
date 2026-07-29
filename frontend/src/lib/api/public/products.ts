import axiosInstance from "@/lib/api/axios-instance";
import { API } from "@/lib/api/endpoints";

// Get all available products (public)
export const getPublicProducts = async () => {
    try {
        const response = await axiosInstance.get(API.public.PRODUCTS);
        return response.data; // { success: true, data: [...] }
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch products");
    }
};

// Get a single product by id (public)
export const getPublicProductById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.public.PRODUCT_BY_ID(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch product");
    }
};