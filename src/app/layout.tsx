import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "RentNest — Find & List Rental Properties",
  description: "A rental property marketplace for tenants, landlords, and admins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="font-sans">
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-140px)] max-w-6xl px-6 py-8">{children}</main>
          <footer className="border-t border-stone/20 py-6 text-center text-sm text-stone">
            RentNest — built for the Programming Hero backend + frontend assignment.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
