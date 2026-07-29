"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import { handleGetPublicProducts } from "@/lib/actions/public/product-action";

const categoryIcons: Record<string, { bg: string }> = {
    "Seed Variety": { bg: "bg-green-100" },
    "Fertilizers and Pesticides": { bg: "bg-yellow-100" },
    "Agriculture Tools": { bg: "bg-blue-100" },
    "Agriculture Equipment": { bg: "bg-purple-100" },
};

const MOCK_CATEGORIES = [
    { _id: "1", name: "Seed Variety" },
    { _id: "2", name: "Fertilizers and Pesticides" },
    { _id: "3", name: "Agriculture Tools" },
    { _id: "4", name: "Agriculture Equipment" },
];

export default function CollectionsPage() {
    const { user, loading } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [productCounts, setProductCounts] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/register";
            return;
        }
        if (user) {
            fetchData();
        }
    }, [user, loading]);

    const fetchData = async () => {
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                handleGetPublicCategories(),
                handleGetPublicProducts(),
            ]);

            let cats: any[] = [];
            if (categoriesRes.success && categoriesRes.data.length > 0) {
                cats = categoriesRes.data;
            } else {
                cats = MOCK_CATEGORIES;
            }
            setCategories(cats);

            const counts: Record<string, number> = {};
            if (productsRes.success) {
                productsRes.data.forEach((p: any) => {
                    const catId = p.categoryId?._id;
                    if (catId) {
                        counts[catId] = (counts[catId] || 0) + 1;
                    }
                });
            }
            setProductCounts(counts);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to load collections. Please try again.");
            // Fallback to mock categories
            setCategories(MOCK_CATEGORIES);
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-lg text-gray-500">Loading collections...</div>
            </div>
        );
    }

    if (!user) return null;

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-green-700 hover:underline">
                    Retry
                </button>
            </div>
        );
    }

    const getSlug = (name: string) => {
        const map: Record<string, string> = {
            "Seed Variety": "seeds",
            "Fertilizers and Pesticides": "fertilizers",
            "Agriculture Tools": "tools",
            "Agriculture Equipment": "equipment",
        };
        return map[name] || name.toLowerCase().replace(/\s+/g, "-");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Our Collections</h1>
            <p className="text-gray-500 mb-8">Browse products by category</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat) => {
                    const slug = getSlug(cat.name);
                    const info = categoryIcons[cat.name] || { bg: "bg-gray-100" };
                    const count = productCounts[cat._id] || 0;

                    return (
                        <Link
                            key={cat._id}
                            href={`/collections/${slug}`}
                            className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition group"
                        >
                            <div className={`h-32 ${info.bg} flex items-center justify-center text-5xl`}>
                                {cat.name === "Seed Variety"}
                                {cat.name === "Fertilizers and Pesticides"}
                                {cat.name === "Agriculture Tools"}
                                {cat.name === "Agriculture Equipment"}
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="font-bold text-gray-800 text-lg">{cat.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">{count} products</p>
                                <span className="inline-block mt-3 text-green-700 font-medium text-sm group-hover:underline">
                                    View Collection →
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
