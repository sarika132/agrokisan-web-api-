"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, SearchIcon, PencilIcon, PlusIcon, EyeIcon } from "lucide-react";
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
import { Button } from "@/components/UI_UX/button";
import { Switch } from "@/components/UI_UX/switch";
import {
    handleDeleteProduct,
    handleUpdateProduct,
} from "@/lib/actions/admin/product-action";
import ProductForm from "./ProductForm";

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    stock: number;
    isAvailable: boolean;
    imageUrl?: string;
    categoryId: Category;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ProductTableProps {
    products: Product[];
    pagination: Pagination;
    search: string;
}

export default function ProductTable({ products, pagination, search }: ProductTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        startTransition(() => {
            router.push(`/dashboard/products?page=1&search=${value}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/products?page=${newPage}&search=${searchTerm}`);
    };

    const handleDelete = async (id: string) => {
        const result = await handleDeleteProduct(id);
        if (result.success) {
            toast.success("Product deleted successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete product", { duration: 1500 });
        }
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setDialogOpen(true);
    };

    const handleAvailabilityToggle = async (product: Product) => {
        const formData = new FormData();
        formData.append("isAvailable", String(!product.isAvailable));

        const result = await handleUpdateProduct(product._id, formData);
        if (result.success) {
            toast.success(
                !product.isAvailable ? "Product marked as available" : "Product marked as unavailable",
                { duration: 1500 }
            );
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update availability", { duration: 1500 });
        }
    };

    return (
        <div>
            {/* Search Bar + Add Product Button */}
            <div className="flex items-center justify-between mb-6">
                <div
                    className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 mr-4 ${isPending ? "opacity-60" : ""
                        }`}
                >
                    <SearchIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search products..."
                        className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Empty State */}
            {products.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No products found.</div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Photo</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Unit</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Available</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        {product.imageUrl ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${product.imageUrl}`}
                                                alt={product.name}
                                                className="h-12 w-16 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-16 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600 font-semibold text-sm">
                                                {product.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">{product.name}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {product.categoryId?.name || "—"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{product.unit}</td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">
                                        NPR {product.price.toLocaleString()}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{product.stock}</td>
                                    <td className="py-4 px-4">
                                        <Switch
                                            checked={product.isAvailable}
                                            onCheckedChange={() => handleAvailabilityToggle(product)}
                                            className="data-[state=checked]:bg-green-500"
                                        />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => router.push(`/dashboard/products/${product._id}`)}
                                                className="text-green-800 hover:text-green-800"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="text-cyan-500 hover:text-green-800"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="text-red-500 hover:text-red-600">
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete <strong>{product.name}</strong>. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(product._id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                {pagination.total} products
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
                                            ? "bg-green-800 text-white border-green-500"
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

            {/* Create/Edit Product Dialog */}
            <ProductForm
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedProduct(null);
                    router.refresh();
                }}
                product={selectedProduct}
            />
        </div>
    );
}