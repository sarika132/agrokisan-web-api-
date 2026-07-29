"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/UI_UX/button";
import { PencilIcon, KeyRound } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg text-gray-500">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Profile</h1>
            <p className="text-gray-500 mb-8">View and manage your profile information</p>

            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 md:p-8">
                {/* Avatar */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="h-24 w-24 rounded-full overflow-hidden bg-green-100 border-2 border-green-200 flex items-center justify-center">
                        {user.imageUrl ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_BASE_URL || ""}${user.imageUrl}`}
                                alt={user.fullName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl font-semibold text-green-600">
                                {user.fullName?.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{user.fullName}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Full Name</p>
                            <p className="text-gray-800">{user.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Email</p>
                            <p className="text-gray-800">{user.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Phone Number</p>
                            <p className="text-gray-800">{user.contactNumber || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Role</p>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {user.role === "admin" ? "Admin" : "Customer"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                    <Link href="/profile/edit">
                        <Button className="bg-green-700 hover:bg-green-800 text-white">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    </Link>
                    <Link href="/profile/change-password">
                        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                            <KeyRound className="h-4 w-4 mr-2" />
                            Change Password
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}