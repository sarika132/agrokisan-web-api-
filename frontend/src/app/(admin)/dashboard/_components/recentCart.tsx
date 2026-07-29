"use client";

import Link from "next/link";

interface CartItem {
    _id: string;
    cartId: string;          // readable cart id
    customerId: {
        fullName: string;
        email: string;
    };
    productId: {
        name: string;
        price: number;
    };
    quantity: number;
    totalPrice: number;
    status: string;          // active, checkedout, cancelled
}

interface RecentCartsProps {
    carts: CartItem[];
}

// status badge colors matching cart statuses
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

export default function RecentCarts({ carts }: RecentCartsProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">Recent Cart Items</h2>
                <Link
                    href="/dashboard/carts"
                    className="text-sm text-green-600 hover:text-cyan-700"
                >
                    View All
                </Link>
            </div>

            {carts.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No cart items</p>
            ) : (
                <div className="space-y-3">
                    {carts.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                            <div>
                                {/* product name */}
                                <p className="text-sm font-medium text-gray-800">
                                    {item.productId?.name || "—"}
                                </p>
                                {/* customer name + cart id */}
                                <p className="text-xs text-gray-400">
                                    {item.customerId?.fullName || "—"} •{" "}
                                    <span className="text-green-600">{item.cartId}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* total price */}
                                <p className="text-sm font-medium text-gray-700">
                                    NPR {item.totalPrice?.toLocaleString()}
                                </p>
                                {/* status badge */}
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getStatusStyles(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}