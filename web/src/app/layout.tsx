import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Reveal Your Photo Puzzle",
  description: "Turn your photos into a printable black-and-white pattern puzzle.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-semibold text-xl tracking-wide hover:opacity-80 transition-opacity">
              Reveal<span className="text-neutral-500 font-light">Art</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
              <Link href="/#collection" className="hover:text-neutral-900 transition-colors">Ready-Made Puzzles</Link>
              <Link href="/create" className="hover:text-neutral-900 transition-colors">Custom Portrait</Link>
              <Link href="/my-puzzles" className="hover:text-neutral-900 transition-colors">My Puzzles</Link>
            </nav>
            <Link href="/create" className="md:hidden text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-full">
              Create
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>

        <footer className="border-t border-neutral-200 bg-white p-6 mt-12">
          <div className="container mx-auto text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Reveal Your Photo Puzzle. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
