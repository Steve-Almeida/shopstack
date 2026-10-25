import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/components/CartProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Exp 9: static Metadata object at the root; child routes inherit via the template
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "ShopStack — a Next.js marketplace", template: "%s | ShopStack" },
  description: "Full-stack Next.js 16 demo: App Router, Prisma, MongoDB, Better Auth and role-based access.",
  openGraph: { type: "website", siteName: "ShopStack" },
  robots: { index: true, follow: true },
};

// Root layout: persistent shell + CartProvider survive every client-side navigation
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <footer className="border-t py-6 text-center text-xs text-neutral-500">
            ShopStack · Next.js · Prisma · Mongoose · Better Auth
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
