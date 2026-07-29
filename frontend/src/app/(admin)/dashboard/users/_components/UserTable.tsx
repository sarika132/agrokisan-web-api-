"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, Trash2Icon, SearchIcon, PencilIcon, PlusIcon } from "lucide-react";
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
import UserFormDialog from "./UserForm";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";

interface User {
    _id: string;
    fullName: string;
    email: string;
    contactNumber: string;
    role: string;
    createdAt: string;
    imageUrl?: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface UserTableProps {
    users: User[];
    pagination: Pagination;
    search: string;
}

export default function UserTable({ users, pagination, search }: UserTableProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        startTransition(() => {
            router.push(`/dashboard/users?page=1&search=${value}`);
        });
    };

    const handlePageChange = (newPage: number) => {
        router.push(`/dashboard/users?page=${newPage}&search=${searchTerm}`);
    };

    const handleDelete = async (id: string) => {
        const result = await handleDeleteUser(id);
        if (result.success) {
            toast.success("User deleted successfully", { duration: 1500 });
            router.refresh();
        } else {
            toast.error(result.message || "Failed to delete user", { duration: 1500 });
        }
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Search Bar + Add User Button */}
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
                        placeholder="Search customers..."
                        className="outline-none text-sm w-full text-gray-700 placeholder:text-gray-400"
                    />
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-green-700 hover:bg-green-800 flex items-center gap-2 text-white"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Empty State */}
            {users.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No customers found.</div>
            ) : (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Phone</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-sm font-medium text-gray-800">{user.fullName}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{user.email}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{user.contactNumber}</td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            {/* View details */}
                                            <button
                                                onClick={() => router.push(`/dashboard/users/${user._id}`)}
                                                className="text-green-600 hover:text-green-700"
                                                title="View details"
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </button>

                                            {/* Edit user */}
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-green-600 hover:text-green-700"
                                                title="Edit user"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </button>

                                            {/* Delete with confirmation */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button className="text-red-500 hover:text-red-600" title="Delete user">
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete <strong>{user.fullName}</strong>. This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(user._id)}
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
                                {pagination.total} users
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

            {/* Create/Edit user dialog */}
            <UserFormDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                user={selectedUser}
            />
        </div>
    );
}