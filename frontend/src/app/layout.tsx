// src/app/layout.tsx
import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/UI_UX/sonner";
import { AuthProvider } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "AgroKisan - Innovating Agriculture for your convenience",
  description:
    "Empowering farmers with quality seeds, fertilizers, tools, and equipment for sustainable agriculture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.className, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}