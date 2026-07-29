import {
    PackageIcon,
    ShoppingCartIcon,
    UsersIcon,
    DollarSignIcon,
} from "lucide-react";
import { handleGetDashboardStats } from "@/lib/actions/admin/dashboard-action";
import StatCard from "./_components/StatCard";
import CartStatus from "./_components/CartStatus";
import RecentCarts from "./_components/recentCart";
import RecentCustomers from "./_components/RecentCustomers";
import QuickActions from "./_components/QuickAction";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const result = await handleGetDashboardStats();

    // The action now always returns success, but keep this for safety
    if (!result.success) {
        throw new Error(result.message);
    }

    const stats = result.data;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
            </div>

            {/* Top stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts || 0}
                    icon={<PackageIcon className="h-5 w-5 text-white" />}
                    iconBgColor="bg-green-600"
                    badge={`${stats.availableProducts || 0} available`}
                    badgeColor="text-green-600 bg-green-50"
                />
                <StatCard
                    title="Total Carts"
                    value={stats.totalCarts || 0}
                    icon={<ShoppingCartIcon className="h-5 w-5 text-white" />}
                    iconBgColor="bg-green-600"
                    badge={`${stats.activeCarts || 0} active`}
                    badgeColor="text-yellow-600 bg-yellow-50"
                />
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers || 0}
                    icon={<UsersIcon className="h-5 w-5 text-white" />}
                    iconBgColor="bg-green-600"
                    badge={`${stats.totalProducts || 0} products`}
                    badgeColor="text-blue-600 bg-blue-50"
                />
                <StatCard
                    title="Total Revenue"
                    value={`NPR ${(stats.totalRevenue || 0).toLocaleString()}`}
                    icon={<DollarSignIcon className="h-5 w-5 text-white" />}
                    iconBgColor="bg-green-600"
                    badge="completed"
                    badgeColor="text-green-600 bg-green-50"
                />
            </div>

            {/* Cart status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <CartStatus
                    activeCarts={stats.activeCarts || 0}
                    checkedOutCarts={stats.checkedOutCarts || 0}
                    cancelledCarts={stats.cancelledCarts || 0}
                />
            </div>

            {/* Recent carts & customers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <RecentCarts carts={stats.recentCarts || []} />
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <RecentCustomers customers={stats.recentCustomers || []} />
                </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <QuickActions />
            </div>
        </div>
    );
}