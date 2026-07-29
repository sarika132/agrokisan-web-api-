"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI_UX/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/context/AuthContext";
import bgImage from "@/app/assets/bg.jpg";
import bg2Image from "@/app/assets/bg2.jpg";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleShopNow = () => {
    if (user) {
      router.push("/products");
    } else {
      router.push("/register");
    }
  };

  const handleCollectionClick = (slug: string) => {
    if (user) {
      router.push(`/collections/${slug}`);
    } else {
      router.push("/login");
    }
  };

  const heroImage = user ? bg2Image : bgImage;

  // Collection data
  const collections = [
    {
      slug: "seeds",
      title: "Seed Variety",
      image: "/images/categories/seeds.png",
    },
    {
      slug: "fertilizers",
      title: "Fertilizers and Pesticides",
      image: "/images/categories/fertilizers.png",
    },
    {
      slug: "tools",
      title: "Agriculture Tools",
      image: "/images/categories/tools.png",
    },
    {
      slug: "equipment",
      title: "Agriculture Equipment",
      image: "/images/categories/equipment.png",
    },
  ];

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] w-full">
        <Image
          src={heroImage}
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
          <Button
            onClick={handleShopNow}
            className="mt-6 bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg"
          >
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {collections.map((collection) => (
            <div
              key={collection.slug}
              onClick={() => handleCollectionClick(collection.slug)}
              className="bg-white rounded-xl shadow-md border border-green-100 overflow-hidden hover:shadow-lg transition cursor-pointer group"
            >
              <div className="h-48 bg-green-100 flex items-center justify-center relative">
                {/* Image with fallback to emoji if not found */}
                <Image
                  src={collection.image}
                  alt={collection.title}
                  width={192}
                  height={192}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    // If image fails, show an emoji placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement("span");
                      span.className = "text-6xl";
                      span.textContent = "🌱";
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
              <div className="p-5 flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-800 text-lg">
                  {collection.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">More Items</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCollectionClick(collection.slug);
                  }}
                  className="mt-3 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  View Collection
                </button>
              </div>
            </div>
          ))}
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

          <div className="flex justify-center gap-8 mt-8 text-sm">
            <Link href="/" className="text-green-700 hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-green-700 hover:underline">
              About us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}