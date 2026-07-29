"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon, StarIcon } from "lucide-react";
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
import { handleDeleteReview } from "@/lib/actions/admin/review-action";

interface Customer {
    _id: string;
    fullName: string;
    email: string;
}

interface Product {
    _id: string;
    name: string;
}

interface Review {
    _id: string;
    customerId: Customer;
    productId: Product;        // changed from vehicleId
    rating: number;
    comment: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ReviewTableProps {
    reviews: Review[];
    pagination: Pagination;
}

// Star rating component (unchanged)
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                    key={star}
                    className={`h-4 w-4 ${star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                />
            ))}
            <span className="text-sm text-gray-500 ml-1">({rating})</span>
        </div>
    );
};

export default function ReviewTable({ reviews, pagination }: ReviewTableProps) {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/reviews?page=${newPage}`);
    };

    const handleDelete = async (id: string) => {
        const result = await handleDeleteReview(id);
        if (result.success) {
            toast.success("Review deleted successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete review", {
                duration: 1500,
            });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                    No reviews found.
                </div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Customer
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Product           {/* changed from Vehicle */}
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Rating
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Comment
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Date
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <p className="text-sm font-medium text-gray-800">
                                            {review.customerId?.fullName || "—"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {review.customerId?.email || ""}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-800">
                                        {review.productId?.name || "—"}     {/* productId */}
                                    </td>
                                    <td className="py-4 px-4">
                                        <StarRating rating={review.rating} />
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500 max-w-xs">
                                        <p className="truncate">{review.comment}</p>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="text-red-500 hover:text-red-600">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete the review by{" "}
                                                        <strong>{review.customerId?.fullName}</strong> for{" "}
                                                        <strong>{review.productId?.name}</strong>. This
                                                        action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(review._id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
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
                                {pagination.total} reviews
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
                                                ? "bg-cyan-500 text-white border-cyan-500"
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