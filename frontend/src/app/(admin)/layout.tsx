"use client";
import UserMenu from "@/components/UserMenu";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-16 flex items-center justify-end px-6 border-b bg-white">
                    <UserMenu />
                </header>
                <main className="flex-1 bg-gray-50 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}