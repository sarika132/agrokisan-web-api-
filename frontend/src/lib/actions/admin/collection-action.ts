"use server";

import { revalidatePath } from "next/cache";
import {
    getAllCollections,
    createCollection,
    updateCollection,
    deleteCollection,
} from "@/lib/api/admin/collection";

export const handleGetAllCollections = async ({
    page,
    limit,
    search,
}: {
    page?: number;
    limit?: number;
    search?: string;
}) => {
    try {
        const currentPage = page || 1;
        const currentLimit = limit || 10;
        const currentSearch = search || "";

        const result = await getAllCollections({
            page: currentPage,
            limit: currentLimit,
            search: currentSearch,
        });

        if (result.success) {
            return {
                success: true,
                data: result.data?.data ?? [],
                pagination: result.data?.pagination ?? {
                    page: currentPage,
                    limit: currentLimit,
                    total: 0,
                    totalPages: 0,
                },
            };
        }
        return { success: false, message: result.message || "Failed to fetch collections" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch collections" };
    }
};

export const handleCreateCollection = async (data: FormData) => {
    try {
        const result = await createCollection(data);
        if (result.success) {
            revalidatePath("/dashboard/collections");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Collection creation failed" };
    } catch (error: any) {
        return { success: false, message: error.message || "Collection creation failed" };
    }
};

export const handleUpdateCollection = async (id: string, data: FormData) => {
    try {
        const result = await updateCollection(id, data);
        if (result.success) {
            revalidatePath("/dashboard/collections");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update collection" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update collection" };
    }
};

export const handleDeleteCollection = async (id: string) => {
    try {
        const result = await deleteCollection(id);
        if (result.success) {
            revalidatePath("/dashboard/collections");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to delete collection" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete collection" };
    }
};