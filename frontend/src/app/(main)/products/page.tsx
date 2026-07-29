"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { handleGetPublicProducts } from "@/lib/actions/public/product-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import { handleAddToCart } from "@/lib/actions/public/cart-action";
import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import { toast } from "sonner";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    imageUrl?: string;
    stock: number;
    isAvailable: boolean;
    categoryId: {
        _id: string;
        name: string;
    };
}

const categoryDisplayMap: Record<string, { label: string; icon: string }> = {
    "Seed Variety": { label: "Seeds", icon: "🌱" },
    "Fertilizers and Pesticides": { label: "Fertilizers & Pesticides", icon: "🧪" },
    "Agriculture Tools": { label: "Tools", icon: "🔧" },
    "Agriculture Equipment": { label: "Equipment", icon: "🚜" },
};

const extraFilters: { id: string; label: string; icon: string; categoryName: string }[] = [
    { id: "vegetable-seeds", label: "Vegetable Seeds", icon: "🥬", categoryName: "Seed Variety" },
];

export default function ProductsPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            window.location.href = "/register";
        }
    }, [user, loading]);

    // Fetch products and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    handleGetPublicProducts(),
                    handleGetPublicCategories(),
                ]);

                if (productsRes.success) {
                    setProducts(productsRes.data || []);
                } else {
                    toast.error(productsRes.message || "Failed to load products");
                }

                if (categoriesRes.success) {
                    setCategories(categoriesRes.data || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    // ✅ Use useMemo for filtering – no dependency array size issues
    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (selectedCategoryId) {
            const extraFilter = extraFilters.find((f) => f.id === selectedCategoryId);
            if (extraFilter) {
                const category = categories.find((c) => c.name === extraFilter.categoryName);
                if (category) {
                    filtered = filtered.filter((p) => p.categoryId?._id === category._id);
                }
            } else {
                filtered = filtered.filter((p) => p.categoryId?._id === selectedCategoryId);
            }
        }

        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    p.name.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term)
            );
        }

        return filtered;
    }, [selectedCategoryId, searchTerm, products, categories]);

    const handleAddToCartClick = async (productId: string, productName: string) => {
        if (!user) {
            router.push("/register");
            return;
        }

        try {
            const result = await handleAddToCart(productId, 1);
            if (result.success) {
                toast.success(`${productName} added to cart!`);
                setTimeout(() => router.push("/cart"), 500);
            } else {
                toast.error(result.message || "Failed to add to cart");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        }
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    const allCategories = [
        { id: "", label: "All", icon: "📦" },
        ...categories.map((cat) => ({
            id: cat._id,
            label: categoryDisplayMap[cat.name]?.label || cat.name,
            icon: categoryDisplayMap[cat.name]?.icon || "📌",
        })),
        ...extraFilters.map((f) => ({
            id: f.id,
            label: f.label,
            icon: f.icon,
        })),
    ];

    return (
        <div className="py-8 px-4 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-green-800">Our Products</h1>
                <p className="text-gray-500 mt-1">
                    Browse our wide selection of agricultural products
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
                <div className="flex flex-wrap gap-3">
                    {allCategories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${selectedCategoryId === cat.id
                                ? "bg-green-700 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading products...</div>
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                    {searchTerm || selectedCategoryId
                        ? "No products match your filters"
                        : "No products available right now"}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition group"
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
                                <h3 className="font-bold text-gray-800 text-lg truncate">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-lg font-bold text-green-700">
                                        NPR {product.price.toLocaleString()}
                                        <span className="text-sm font-normal text-gray-500">
                                            /{product.unit}
                                        </span>
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        onClick={() => handleAddToCartClick(product._id, product.name)}
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