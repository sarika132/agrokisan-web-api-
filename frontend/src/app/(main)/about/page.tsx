"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div>
            {/* Hero / Banner – using image from public folder */}
            <section className="relative h-80 w-full">
                <Image
                    src="/images/about/about.png"   // ✅ correct path (without /public)
                    alt="About AgroKisan"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold">About AgroKisan</h1>
                    <p className="text-lg mt-2 text-gray-200">
                        Empowering Nepalese farmers with quality agricultural resources
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4 max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-md border border-green-100 p-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">Who We Are</h2>
                    <p className="text-gray-700 leading-relaxed">
                        AgroKisan is Nepal's trusted agricultural marketplace. We connect farmers
                        with high-quality seeds, fertilizers, tools, and equipment from reliable
                        suppliers. Our mission is to make farming more productive, sustainable,
                        and profitable for every Nepali farmer.
                    </p>

                    <h2 className="text-2xl font-bold text-green-800 mt-8 mb-4">Our Mission</h2>
                    <p className="text-gray-700 leading-relaxed">
                        To provide every farmer with access to the best agricultural inputs,
                        expert advice, and modern farming solutions - all in one place.
                    </p>

                    <h2 className="text-2xl font-bold text-green-800 mt-8 mb-4">Why Choose Us</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Wide range of quality products</li>
                        <li>Competitive prices</li>
                        <li>Expert guidance</li>
                        <li>Reliable delivery across Nepal</li>
                    </ul>

                    <div className="mt-10 text-center">
                        <Link
                            href="/products"
                            className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-3 rounded-lg transition"
                        >
                            Explore Our Products
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}