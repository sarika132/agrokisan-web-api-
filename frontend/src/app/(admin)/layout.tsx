"use client";

import UserMenu from "@/components/UserMenu";
import AdminSidebar from "@/components/AdminSidebar";
import { ExternalLinkIcon, Link } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm font-medium text-[#51636a] hover:text-cyan-600 transition-colors"
                    >
                        <ExternalLinkIcon className="h-4 w-4" />
                        View Site
                    </Link>
                    <UserMenu />

                </header>

                <main className="flex-1 bg-gray-50 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}