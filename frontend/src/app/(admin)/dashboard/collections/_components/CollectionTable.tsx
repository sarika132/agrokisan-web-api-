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
import { handleDeleteCollection } from "@/lib/actions/admin/collection-action";
import CollectionForm from "./CollectionForm";

interface Collection {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface CollectionTableProps {
    collections: Collection[];
    pagination: Pagination;
    search: string;
}

const COLLECTION_NAMES = [
    "Spring Collection",
    "Summer Collection",
    "Autumn Collection",
    "Winter Collection",
    "Limited Edition",
];

export default function CollectionTable({
    collections,
    pagination,
    search,
}: CollectionTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(
        null
    );
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        startTransition(() => {
            router.push(`/dashboard/collections?page=1&search=${value}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/collections?page=${newPage}&search=${searchTerm}`);
    };

    const handleDelete = async (id: string) => {
        const result = await handleDeleteCollection(id);
        if (result.success) {
            toast.success("Collection deleted successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete collection", {
                duration: 1500,
            });
        }
    };

    const handleEdit = (collection: Collection) => {
        setSelectedCollection(collection);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedCollection(null);
        setDialogOpen(true);
    };

    return (
        <div>
            {/* Search + Add */}
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
                        placeholder="Search collections..."
                        className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-green-700 hover:bg-green-800 flex items-center gap-2 text-white"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Collection
                </Button>
            </div>

            {collections.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                    No collections found.
                </div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Name
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Description
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Created Date
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.map((collection) => (
                                <tr
                                    key={collection._id}
                                    className="border-b border-gray-50 hover:bg-gray-50"
                                >
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">
                                        {collection.name}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {collection.description || "—"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {new Date(collection.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleEdit(collection)}
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
                                                        <AlertDialogTitle>
                                                            Delete this collection?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete{" "}
                                                            <strong>{collection.name}</strong>. This action
                                                            cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(collection._id)}
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
                                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                                of {pagination.total} collections
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

            <CollectionForm
                open={dialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    setSelectedCollection(null);
                    router.refresh();
                }}
                collection={selectedCollection}
            />
        </div>
    );
}