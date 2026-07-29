"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { toast } from "sonner";
import { ShoppingCartIcon, Trash2Icon, MinusIcon, PlusIcon } from "lucide-react";
import { handleDeleteCartItem, handleGetMyCart, handleUpdateCartItem } from "@/lib/actions/public/cart-action";

interface CartItem {
    _id: string;
    productId: {
        _id: string;
        name: string;
        price: number;
        imageUrl?: string;
        unit: string;
    };
    quantity: number;
    priceAtAdded: number;
    totalPrice: number;
}

export default function CartPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/cart");
            return;
        }
        if (user) {
            fetchCart();
        }
    }, [user, loading]);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const result = await handleGetMyCart();
            if (result.success) {
                setCartItems(result.data || []);
            } else {
                toast.error(result.message || "Failed to load cart");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdating(id);
        try {
            const result = await handleUpdateCartItem(id, newQuantity);
            if (result.success) {
                // Update local state optimistically
                setCartItems((prev) =>
                    prev.map((item) =>
                        item._id === id
                            ? {
                                ...item,
                                quantity: newQuantity,
                                totalPrice: item.priceAtAdded * newQuantity,
                            }
                            : item
                    )
                );
                toast.success("Cart updated");
            } else {
                toast.error(result.message || "Failed to update");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setUpdating(null);
        }
    };

    const removeItem = async (id: string) => {
        if (!confirm("Remove this item from cart?")) return;
        try {
            const result = await handleDeleteCartItem(id);
            if (result.success) {
                setCartItems((prev) => prev.filter((item) => item._id !== id));
                toast.success("Item removed");
            } else {
                toast.error(result.message || "Failed to remove");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        }
    };

    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-lg text-gray-500">Loading cart...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Your Cart</h1>
            <p className="text-gray-500 mb-8">
                Review your items before checkout
            </p>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-12 text-center">
                    <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                    <p className="text-gray-400 mt-2">Browse our products and add items you like</p>
                    <Link href="/products">
                        <Button className="mt-6 bg-green-700 hover:bg-green-800 text-white">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl shadow-md border border-green-100 p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition"
                            >
                                {/* Product Image */}
                                <div className="h-20 w-20 rounded-lg overflow-hidden bg-green-50 flex-shrink-0">
                                    {item.productId.imageUrl ? (
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${item.productId.imageUrl}`}
                                            alt={item.productId.name}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-3xl">
                                            🌱
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-semibold text-gray-800">{item.productId.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        NPR {item.priceAtAdded.toFixed(2)} / {item.productId.unit}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        disabled={updating === item._id || item.quantity <= 1}
                                        className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        disabled={updating === item._id}
                                        className="p-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Item Total */}
                                <div className="text-center sm:text-right min-w-[100px]">
                                    <p className="font-semibold text-gray-800">
                                        NPR {item.totalPrice.toFixed(2)}
                                    </p>
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-500 hover:text-red-700 text-sm flex items-center justify-center sm:justify-end gap-1 mt-1"
                                    >
                                        <Trash2Icon className="h-4 w-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="mt-8 bg-white rounded-xl shadow-md border border-green-100 p-6">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold text-gray-800">
                                NPR {total.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <span className="text-lg font-semibold text-gray-800">Total</span>
                            <span className="text-xl font-bold text-green-700">
                                NPR {total.toFixed(2)}
                            </span>
                        </div>
                        <Button className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white py-3 text-lg">
                            Proceed to Checkout
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}