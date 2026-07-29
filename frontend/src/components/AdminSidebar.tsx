"use client";

import Image from "next/image";
import logo from "@/app/assets/logo.png";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboardIcon,
    UserIcon,
    KeyRoundIcon,
    PackageIcon,
    ShoppingBagIcon,
    SettingsIcon,
} from "lucide-react";

const sidebarItems = [
    { icon: <LayoutDashboardIcon className="h-5 w-5" />, label: "Dashboard", path: "/dashboard" },
    { icon: <UserIcon className="h-5 w-5" />, label: "Profile", path: "/profile" },
    { icon: <KeyRoundIcon className="h-5 w-5" />, label: "Change Password", path: "/change-password" },
    { icon: <PackageIcon className="h-5 w-5" />, label: "Products", path: "/products" },
    { icon: <ShoppingBagIcon className="h-5 w-5" />, label: "Cart", path: "/orders" },
];

export default function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-[#0B2A1E] text-white flex flex-col min-h-screen">
            {/* Logo */}
            <div
                className="flex items-center gap-2 px-6 py-5 cursor-pointer"
                onClick={() => router.push("/")}
            >
                <Image
                    src={logo}
                    alt="AgroKisan Logo"
                    height={40}
                    width={40}
                    className="rounded-lg"
                />
                <span className="text-xl font-semibold text-green-300">AgroKisan</span>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 px-3 mt-2">
                {sidebarItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
              ${pathname === item.path
                                ? "bg-green-600 text-white"
                                : "text-gray-300 hover:bg-green-800/40"
                            }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Optional footer */}
            <div className="mt-auto p-4 border-t border-green-800/40 text-xs text-green-300/60 text-center">
                AgroKisan v1.0
            </div>
        </aside>
    );
}