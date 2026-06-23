"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import { Button } from "@/components/UI_UX/button";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/lib/context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, loading } = useAuth();

    return (
        <nav className="border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src={logo} alt="AgroKisan Logo" width={50} height={45} priority />
                    <span className="text-xl font-bold text-green-800 hidden sm:block">
                        AgroKisan
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="font-medium hover:text-green-700 transition">
                        Home
                    </Link>
                    <Link href="/about" className="font-medium hover:text-green-700 transition">
                        About
                    </Link>
                    <Link href="/services" className="font-medium hover:text-green-700 transition">
                        Services
                    </Link>
                    <Link href="/products" className="font-medium hover:text-green-700 transition">
                        Products
                    </Link>
                    <Link href="/contact" className="font-medium hover:text-green-700 transition">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons / User Menu */}
                <div className="flex items-center gap-3">
                    {!loading && !isAuthenticated && (
                        <>
                            <Button variant="outline" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button className="bg-green-700 hover:bg-green-800 text-white" asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                    {!loading && isAuthenticated && <UserMenu />}
                </div>
            </div>
        </nav>
    );
}