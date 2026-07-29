"use server";

import { revalidatePath } from "next/cache";
import { addToCart, getMyCart, updateCartItem, deleteCartItem } from "@/lib/api/public/cart";

export const handleAddToCart = async (productId: string, quantity: number) => {
    try {
        const result = await addToCart(productId, quantity);
        if (result.success) {
            revalidatePath("/cart");
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to add to cart" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to add to cart" };
    }
};

export const handleGetMyCart = async () => {
    try {
        const result = await getMyCart();
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch cart" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to fetch cart" };
    }
};

export const handleUpdateCartItem = async (id: string, quantity: number) => {
    try {
        const result = await updateCartItem(id, quantity);
        if (result.success) {
            revalidatePath("/cart");
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update cart" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to update cart" };
    }
};

export const handleDeleteCartItem = async (id: string) => {
    try {
        const result = await deleteCartItem(id);
        if (result.success) {
            revalidatePath("/cart");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to remove item" };
    } catch (error: any) {
        return { success: false, message: error.message || "Failed to remove item" };
    }
};