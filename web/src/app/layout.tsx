import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pictoru | Turn Your Photo Into Meaningful Art",
  description: "The premium diamond painting alternative. Upload your favorite photo to instantly generate a stunning, printable pattern puzzle. Relax, unwind, and create truly personal art.",
  openGraph: {
    title: "Pictoru | Turn Your Photo Into Meaningful Art",
    description: "The premium diamond painting alternative. Upload your favorite photo to instantly generate a stunning, printable pattern puzzle. Relax, unwind, and create truly personal art.",
    url: "https://pictoru.com",
    siteName: "Pictoru",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pictoru | Turn Your Photo Into Meaningful Art",
    description: "The premium diamond painting alternative. Upload your favorite photo to instantly generate a stunning, printable pattern puzzle. Relax, unwind, and create truly personal art.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans selection:bg-purple-600 selection:text-white">
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group hover:opacity-90 transition-opacity">
              <img src="/logo.png" alt="Pictoru Logo" className="w-8 h-8 rounded-full" />
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Pictoru
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
              <Link href="/#collection" className="hover:text-purple-600 transition-colors">Ready-Made Puzzles</Link>
              <Link href="/create" className="hover:text-purple-600 transition-colors">Custom Portrait</Link>
              <Link href="/my-puzzles" className="hover:text-purple-600 transition-colors">My Puzzles</Link>
            </nav>
            <Link href="/create" className="md:hidden text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2.5 rounded-full shadow-md">
              Create
            </Link>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>

        <footer className="border-t border-neutral-200 bg-white p-6 mt-12">
          <div className="container mx-auto text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Pictoru. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
