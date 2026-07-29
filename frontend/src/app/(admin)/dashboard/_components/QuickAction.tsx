"use client";

import Link from "next/link";
import {
    PackageIcon,
    ShoppingCartIcon,
    UsersIcon,
    TagIcon,
    Award,
} from "lucide-react";

export default function QuickActions() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
                Quick Actions
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
                {/* Add Product – primary green */}
                <Link
                    href="/dashboard/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <PackageIcon className="h-4 w-4" />
                    Add Product
                </Link>

                {/* View Carts */}
                <Link
                    href="/dashboard/carts"
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg transition-colors"
                >
                    <ShoppingCartIcon className="h-4 w-4" />
                    View Carts
                </Link>

                {/* View Customers */}
                <Link
                    href="/dashboard/users"
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg transition-colors"
                >
                    <UsersIcon className="h-4 w-4" />
                    View Customers
                </Link>

                {/* Collections */}
                <Link
                    href="/dashboard/collections"
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg transition-colors"
                >
                    <TagIcon className="h-4 w-4" />
                    Collections
                </Link>

                {/* Categories */}
                <Link
                    href="/dashboard/categories"
                    className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 text-sm font-medium rounded-lg transition-colors"
                >
                    <Award className="h-4 w-4" />
                    Categories
                </Link>
            </div>
        </div>
    );
}