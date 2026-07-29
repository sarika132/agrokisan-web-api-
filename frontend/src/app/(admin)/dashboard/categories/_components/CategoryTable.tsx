"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, SearchIcon, PencilIcon, PlusIcon } from "lucide-react";
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

import { handleDeleteCategory } from "@/lib/actions/admin/category-action";
import CategoryFormDialog from "./CategoryForm";

interface Category {
    _id: string;
    name: string;
    imageUrl?: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface CategoryTableProps {
    categories: Category[];
    pagination: Pagination;
    search: string;
}

export default function CategoryTable({ categories, pagination, search }: CategoryTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        startTransition(() => {
            router.push(`/dashboard/categories?page=1&search=${value}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/categories?page=${newPage}&search=${searchTerm}`);
    };

    const handleDelete = async (id: string) => {
        const result = await handleDeleteCategory(id);
        if (result.success) {
            toast.success("Category deleted successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete category", { duration: 1500 });
        }
    };

    const handleEdit = (category: Category) => {
        setSelectedCategory(category);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Search Bar + Add Category Button */}
            <div className="flex items-center justify-between mb-6">
                <div className={`flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 mr-4 ${isPending ? "opacity-60" : ""}`}>
                    <SearchIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search categories..."
                        className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-green-700 hover:bg-green-800 flex items-center gap-2 text-white"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Category
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No categories found.</div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Image</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        {category.imageUrl ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${category.imageUrl}`}
                                                alt={category.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                                                {category.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">
                                        {category.name}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="text-green-600 hover:text-green-700"
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
                                                        <AlertDialogTitle>Delete this category?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete{" "}
                                                            <strong>{category.name}</strong>. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(category._id)}
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

                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-500">
                                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                                {pagination.total} categories
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

            <CategoryFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                category={selectedCategory}
            />
        </div>
    );
}