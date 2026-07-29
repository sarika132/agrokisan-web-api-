"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import { handleGetPublicProducts } from "@/lib/actions/public/product-action";
import { Button } from "@/components/UI_UX/button";
import { ShoppingCartIcon, ArrowLeftIcon } from "lucide-react";
import { toast } from "sonner";

const slugToCategory: Record<string, string> = {
    seeds: "Seed Variety",
    fertilizers: "Fertilizers and Pesticides",
    tools: "Agriculture Tools",
    equipment: "Agriculture Equipment",
};

export default function CollectionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const { user, loading } = useAuth();

    const [category, setCategory] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/register");
            return;
        }
        if (user) {
            fetchData();
        }
    }, [user, loading, slug]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [categoriesRes, productsRes] = await Promise.all([
                handleGetPublicCategories(),
                handleGetPublicProducts(),
            ]);

            if (categoriesRes.success && productsRes.success) {
                const categoryName = slugToCategory[slug];
                const foundCategory = categoriesRes.data.find(
                    (c: any) => c.name === categoryName
                );
                if (foundCategory) {
                    setCategory(foundCategory);
                    const filtered = productsRes.data.filter(
                        (p: any) => p.categoryId?._id === foundCategory._id
                    );
                    setProducts(filtered);
                } else {
                    setCategory(null);
                    setProducts([]);
                }
            } else {
                setError("Failed to load collection");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="text-green-700 hover:underline">
                    Retry
                </button>
                <Link href="/collections" className="block mt-4 text-green-700 hover:underline">
                    ← Back to Collections
                </Link>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center">
                <h1 className="text-2xl font-bold text-gray-700">Collection not found</h1>
                <Link href="/collections" className="text-green-700 hover:underline mt-4 inline-block">
                    ← Back to Collections
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-6"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
            </button>

            <h1 className="text-3xl font-bold text-green-800 mb-2">{category.name}</h1>
            <p className="text-gray-500 mb-8">{products.length} products available</p>

            {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No products in this collection yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="h-48 bg-green-50 flex items-center justify-center relative">
                                {product.imageUrl ? (
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${product.imageUrl}`}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <span className="text-6xl">🌱</span>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 text-lg truncate">{product.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-lg font-bold text-green-700">
                                        NPR {product.price.toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                                    </span>
                                    <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        onClick={() => toast.success(`${product.name} added to cart!`)}
                                        className="flex-1 bg-green-700 hover:bg-green-800 text-white text-sm py-2"
                                        disabled={product.stock === 0}
                                    >
                                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                                        Add to Cart
                                    </Button>
                                    <Link
                                        href={`/products/${product._id}`}
                                        className="px-3 py-2 text-sm border border-green-700 text-green-700 rounded-lg hover:bg-green-50 transition"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}