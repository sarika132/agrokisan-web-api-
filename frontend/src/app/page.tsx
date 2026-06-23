"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI_UX/button";
import Navbar from "@/components/Navbar"; // ✅ Import Navbar
import { useAuth } from "@/lib/context/AuthContext";
import bgImage from "@/app/assets/bg.jpg";
import farmImage from "@/app/assets/farm.jpg";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* ✅ Add Navbar here */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        <Image
          src={bgImage}
          alt="Agriculture"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
          <p className="text-sm font-medium tracking-widest text-green-300 uppercase">
            Our Collection
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mt-2">
            Innovating Agriculture
          </h1>
          <p className="text-lg md:text-xl mt-2 text-gray-200">
            for your convenience
          </p>
          <Button className="mt-6 bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg">
            SHOP NOW
          </Button>
        </div>
      </section>

      {/* Bestsellers Banner */}
      <div className="bg-green-700 py-3 text-center">
        <p className="text-white text-sm font-medium tracking-widest">
          BESTSELLERS
        </p>
      </div>

      {/* Our Collections Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-2">
          OUR COLLECTIONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {/* Seed Variety */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-6xl">🌱</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg">Seed Variety</h3>
              <Link
                href="/collections/seeds"
                className="text-green-700 text-sm font-medium hover:underline inline-block mt-2"
              >
                View Collection →
              </Link>
            </div>
          </div>

          {/* Fertilizers and Pesticides */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-6xl">🌿</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg">
                Fertilizers and Pesticides
              </h3>
              <Link
                href="/collections/fertilizers"
                className="text-green-700 text-sm font-medium hover:underline inline-block mt-2"
              >
                View Collection →
              </Link>
            </div>
          </div>

          {/* Agriculture Tools */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-6xl">🔧</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg">
                Agriculture Tools
              </h3>
              <Link
                href="/collections/tools"
                className="text-green-700 text-sm font-medium hover:underline inline-block mt-2"
              >
                View Collection →
              </Link>
            </div>
          </div>

          {/* Agriculture Equipment */}
          <div className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-6xl">🚜</span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg">
                Agriculture Equipment
              </h3>
              <Link
                href="/collections/equipment"
                className="text-green-700 text-sm font-medium hover:underline inline-block mt-2"
              >
                View Collection →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About / Bottom Section */}
      <section className="bg-green-50 py-16 px-4 border-t border-green-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-4">AgroKisan</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
            We believe every farming resource you access through AgroKisan should
            support your productivity, quality, and growth. That's why we're
            passionate about offering a wide range of seeds, fertilizers, tools,
            and equipment that help farmers improve their work and make
            agriculture more efficient and reliable.
          </p>

          {/* Footer Links */}
          <div className="flex justify-center gap-8 mt-8 text-sm">
            <Link href="/" className="text-green-700 hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-green-700 hover:underline">
              About us
            </Link>
            <Link href="/delivery" className="text-green-700 hover:underline">
              Delivery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}