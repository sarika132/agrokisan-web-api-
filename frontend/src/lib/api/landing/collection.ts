import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// fetch all collections for public listing
export const getPublicCollections = async () => {
    try {
        const response = await axiosInstance.get(API.landing.COLLECTIONS);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch collections",
        );
    }
};

// fetch single collection by id
export const getPublicCollectionById = async (id: string) => {
    try {
        const response = await axiosInstance.get(
            API.landing.COLLECTION_BY_ID ? API.landing.COLLECTION_BY_ID(id) : `/api/collection/${id}`
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(
            error?.response?.data?.message || "Failed to fetch collection",
        );
    }
};