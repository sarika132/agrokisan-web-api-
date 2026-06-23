"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-green-800">Dashboard</h1>
            <p className="text-gray-600 mt-4">Welcome, {user?.fullName}!</p>
        </div>
    );
}