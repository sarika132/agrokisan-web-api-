import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// fetch all products for public listing page
export const getPublicProducts = async () => {
    try {
        const response = await axiosInstance.get(API.landing.PRODUCTS);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch products",
        );
    }
};

// fetch single product by id for detail page
export const getPublicProductById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.landing.PRODUCT_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch product",
        );
    }
};

// search products
export const searchPublicProducts = async (query: string) => {
    try {
        const response = await axiosInstance.get(API.landing.PRODUCTS_SEARCH, {
            params: { q: query },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to search products",
        );
    }
};

// get products by category
export const getProductsByCategory = async (categoryId: string) => {
    try {
        const response = await axiosInstance.get(API.landing.PRODUCTS_BY_CATEGORY, {
            params: { categoryId },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch products by category",
        );
    }
};

// get products by collection
export const getProductsByCollection = async (collectionId: string) => {
    try {
        const response = await axiosInstance.get(API.landing.PRODUCTS_BY_COLLECTION, {
            params: { collectionId },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch products by collection",
        );
    }
};