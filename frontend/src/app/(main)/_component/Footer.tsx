"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0F172A] text-gray-300 px-14 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Image src={logo} alt="AgroKisan" width={40} height={40} />
                        <span className="text-white font-bold text-lg">AgroKisan</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Nepal’s trusted agricultural marketplace. Quality seeds, fertilizers, tools, and equipment to help farmers grow more efficiently.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-green-400 transition-colors">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/products" className="hover:text-green-400 transition-colors">
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-green-400 transition-colors">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-green-400 transition-colors">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-green-400 transition-colors">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
                        Categories
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/products?category=Seed Variety" className="hover:text-green-400 transition-colors">
                                Seed Variety
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=Fertilizers and Pesticides" className="hover:text-green-400 transition-colors">
                                Fertilizers &amp; Pesticides
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=Agriculture Tools" className="hover:text-green-400 transition-colors">
                                Agriculture Tools
                            </Link>
                        </li>
                        <li>
                            <Link href="/products?category=Agriculture Equipment" className="hover:text-green-400 transition-colors">
                                Agriculture Equipment
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">
                        Get in Touch
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                            <MapPinIcon className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                            <span>Kathmandu, Nepal</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <PhoneIcon className="h-4 w-4 text-green-400 shrink-0" />
                            <span>+977-1-4567890</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <MailIcon className="h-4 w-4 text-green-400 shrink-0" />
                            <span>info@agrokisan.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* bottom bar */}
            <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <p>© 2026 AgroKisan. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="hover:text-green-400 transition-colors">
                        Terms
                    </Link>
                    <Link href="#" className="hover:text-green-400 transition-colors">
                        Privacy
                    </Link>
                </div>
            </div>
        </footer>
    );
}