"use server";

import { getAllCarts, getCartByCustomerId } from "@/lib/api/admin/cart";
import { revalidatePath } from "next/cache";

export const handleGetAllCarts = async ({
    page,
    limit,
    search,
    status,
}: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}): Promise<{
    success: boolean;
    data?: any[];
    pagination?: any;
    message?: string;
}> => {
    try {
        const currentPage = page || 1;
        const currentLimit = limit || 10;
        const currentSearch = search || "";
        const currentStatus = status || "all";

        const result = await getAllCarts({
            page: currentPage,
            limit: currentLimit,
            search: currentSearch,
            status: currentStatus,
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
        return { success: false, message: result.message || "Failed to fetch carts" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch carts" };
    }
};

export const handleGetCartById = async (id: string): Promise<any> => {
    try {
        const result = await getCartById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch cart item" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch cart item" };
    }
};

export const handleGetCartByUserId = async (userId: string): Promise<any> => {
    try {
        const result = await getCartByCustomerId(userId);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch user's cart" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch user's cart" };
    }
};

export const handleUpdateCartStatus = async (
    id: string,
    status: "active" | "checkedout" | "cancelled"
): Promise<any> => {
    try {
        const result = await updateCartStatus(id, status);
        if (result.success) {
            revalidatePath("/dashboard/carts");
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update cart status" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update cart status" };
    }
};

export const handleDeleteCartItem = async (id: string): Promise<any> => {
    try {
        const result = await deleteCartItem(id);
        if (result.success) {
            revalidatePath("/dashboard/carts");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to delete cart item" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to delete cart item" };
    }
};

// Aliases for backward compatibility
export const getCartById = handleGetCartById;
export const updateCartStatus = handleUpdateCartStatus;
export const deleteCartItem = handleDeleteCartItem;