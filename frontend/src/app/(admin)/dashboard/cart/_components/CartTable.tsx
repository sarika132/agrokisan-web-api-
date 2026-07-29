"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/UI_UX/alert-dialog";
import {
    updateCartStatus,
    deleteCartItem,
} from "@/lib/actions/admin/cart-action";

interface Customer {
    _id: string;
    fullName: string;
    email: string;
}

interface Product {
    _id: string;
    name: string;
}

interface CartItem {
    _id: string;
    cartId: string;
    customerId: Customer;
    productId: Product;
    quantity: number;
    priceAtAdded: number;
    totalPrice: number;
    status: "active" | "checkedout" | "cancelled";
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface CartTableProps {
    carts: CartItem[];
    pagination: Pagination;
    search: string;
    currentStatus: string;
}

const STATUS_TABS = ["all", "active", "checkedout", "cancelled"];

const getStatusStyles = (status: string) => {
    switch (status) {
        case "active":
            return "bg-yellow-100 text-yellow-700";
        case "checkedout":
            return "bg-green-100 text-green-700";
        case "cancelled":
            return "bg-red-100 text-red-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
};

export default function CartTable({
    carts,
    pagination,
    search,
    currentStatus,
}: CartTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        startTransition(() => {
            router.push(
                `/dashboard/carts?page=1&search=${value}&status=${currentStatus}`
            );
        });
    };

    const handleStatusFilter = (status: string) => {
        router.push(
            `/dashboard/carts?page=1&search=${searchTerm}&status=${status}`
        );
    };

    const handlePageChange = (newPage: number) => {
        router.push(
            `/dashboard/carts?page=${newPage}&search=${searchTerm}&status=${currentStatus}`
        );
    };

    const handleCheckout = async (id: string) => {
        const result = await updateCartStatus(id, "checkedout");
        if (result.success) {
            toast.success("Cart checked out successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update cart status", {
                duration: 1500,
            });
        }
    };

    const handleCancel = async (id: string) => {
        const result = await updateCartStatus(id, "cancelled");
        if (result.success) {
            toast.success("Cart item cancelled", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to cancel cart", {
                duration: 1500,
            });
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteCartItem(id);
        if (result.success) {
            toast.success("Cart item deleted", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete cart", {
                duration: 1500,
            });
        }
    };

    return (
        <div>
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleStatusFilter(tab)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition ${currentStatus === tab
                                ? "bg-green-700 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div
                className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 mb-6 ${isPending ? "opacity-60" : ""
                    }`}
            >
                <SearchIcon className="h-4 w-4 text-gray-400 shrink-0" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search by cart ID, customer, or product..."
                    className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                />
            </div>

            {carts.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                    No cart items found.
                </div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Cart ID
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Customer
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Product
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Qty
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Unit Price
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Total
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {carts.map((cart) => (
                                <tr
                                    key={cart._id}
                                    className="border-b border-gray-50 hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-sm font-medium text-green-700">
                                        {cart.cartId}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-800">
                                        {cart.customerId?.fullName || "—"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-800">
                                        {cart.productId?.name || "—"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {cart.quantity}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        NPR {cart.priceAtAdded?.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">
                                        NPR {cart.totalPrice?.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusStyles(cart.status)}`}
                                        >
                                            {cart.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    router.push(`/dashboard/carts/${cart._id}`)
                                                }
                                                className="text-green-600 hover:text-green-700"
                                                title="View"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>

                                            {cart.status === "active" && (
                                                <>
                                                    <button
                                                        onClick={() => handleCheckout(cart._id)}
                                                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                                    >
                                                        Checkout
                                                    </button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <button className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                                                Cancel
                                                            </button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>
                                                                    Cancel this cart item?
                                                                </AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will cancel the cart item{" "}
                                                                    <strong>{cart.cartId}</strong> for{" "}
                                                                    <strong>
                                                                        {cart.customerId?.fullName}
                                                                    </strong>
                                                                    . This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Back</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleCancel(cart._id)}
                                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                                >
                                                                    Cancel
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}

                                            {cart.status === "cancelled" && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <button className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                                            Delete
                                                        </button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Permanently delete this cart item?
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently remove the cart item{" "}
                                                                <strong>{cart.cartId}</strong>. This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Back</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDelete(cart._id)}
                                                                className="bg-red-600 hover:bg-red-700 text-white"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                                of {pagination.total} cart items
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1.5 text-sm border rounded-lg ${pagination.page === i + 1
                                                ? "bg-green-700 text-white border-green-700"
                                                : "border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}