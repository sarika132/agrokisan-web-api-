import Image from "next/image";
import logo from "@/app/assets/logo.png";
import Link from "next/link";
import { Button } from "@/components/button";

export default function HomePage() {
  return (
    <div>
      <nav className="border-b bg-white">
        <div className="container mx-auto flex h-15 items-center justify-between px-6">

          {/* Logo */}
          <div>
            <Image
              src={logo}
              alt="AgroKisan Logo"
              width={70}
              height={50}
              priority
            />
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-10">
            <Link href="/" className="font-medium transition-colors duration-200 hover:text-green-600">
              Home
            </Link>
            <Link href="#" className="font-medium transition-colors duration-200 hover:text-green-600">
              About
            </Link>
            <Link href="#" className="font-medium transition-colors duration-200 hover:text-green-600">
              Services
            </Link>
            <Link href="#" className="font-medium transition-colors duration-200 hover:text-green-600">
              Products
            </Link>
            <Link href="#" className="font-medium transition-colors duration-200 hover:text-green-600">
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </Link>
          </div>

        </div>
      </nav>
    </div>
  );
}