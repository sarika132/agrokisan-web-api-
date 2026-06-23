"use client";

import { Button } from "@/components/UI_UX/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI_UX/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/UI_UX/dropdown-menu";

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

import {
    UserIcon,
    LayoutDashboardIcon,
    LogOutIcon,
    ShieldUser,
    SettingsIcon,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
    const { logout, user } = useAuth();
    const router = useRouter();

    // Build full image URL from backend (using profileImage)
    const avatarSrc = user?.profileImage
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${user.profileImage}`
        : undefined;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 rounded-full px-2 hover:bg-green-50">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={avatarSrc} alt="User" />
                        <AvatarFallback className="bg-green-100 text-green-800 text-xs font-semibold">
                            {user?.fullName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-medium text-gray-800">{user?.fullName}</span>
                        {user?.role === "admin" && (
                            <span className="text-xs text-green-700 font-light">Admin</span>
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-green-800">My Account</DropdownMenuLabel>

                <DropdownMenuGroup>
                    {/* Profile */}
                    <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                        onClick={() => router.push("/profile")}
                    >
                        <UserIcon className="h-4 w-4 text-green-700" />
                        <span>Profile</span>
                    </DropdownMenuItem>

                    {/* Dashboard - visible for all authenticated users */}
                    <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                        onClick={() => router.push("/dashboard")}
                    >
                        <LayoutDashboardIcon className="h-4 w-4 text-green-700" />
                        <span>Dashboard</span>
                    </DropdownMenuItem>

                    {/* Settings (optional) */}
                    <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                        onClick={() => router.push("/settings")}
                    >
                        <SettingsIcon className="h-4 w-4 text-green-700" />
                        <span>Settings</span>
                    </DropdownMenuItem>

                    {/* Admin Panel – only for admins */}
                    {user?.role === "admin" && (
                        <DropdownMenuItem
                            className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                            onClick={() => router.push("/admin")}
                        >
                            <ShieldUser className="h-4 w-4 text-amber-600" />
                            <span>Admin Panel</span>
                        </DropdownMenuItem>
                    )}

                    {/* Logout with confirmation */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <LogOutIcon className="h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    You will need to login again to access your account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => {
                                        logout();
                                    }}
                                    className="bg-red-700 hover:bg-red-800 text-white"
                                >
                                    Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}