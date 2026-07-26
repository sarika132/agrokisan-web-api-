import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// get all products with pagination and optional search for admin dashboard
export const getAllProducts = async (params: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_ALL, {
            params,
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch products",
        );
    }
};

// get a single product by id for admin detail/edit page
export const getProductById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_BY_ID(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch product",
        );
    }
};

// admin creates a new product - multipart because image upload is possible
export const createProduct = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.PRODUCTS.CREATE, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to create product",
        );
    }
};

// admin updates a product - multipart because image can be changed
export const updateProduct = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.PRODUCTS.UPDATE(id),
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update product",
        );
    }
};

// admin deletes a product by id
export const deleteProduct = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.PRODUCTS.DELETE(id));
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to delete product",
        );
    }
};

// admin updates product availability (toggle isAvailable)
export const updateProductAvailability = async (id: string) => {
    try {
        const response = await axiosInstance.put(
            API.ADMIN.PRODUCTS.UPDATE_AVAILABILITY(id)
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to update product availability",
        );
    }
};