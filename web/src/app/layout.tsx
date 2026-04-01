import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Testimonials from "@/components/Testimonials";
import Link from "next/link";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dot Painting & Grid Art Kits | DIY Art Kits | Pictoru",
  description: "Unwind and get creative with Pictoru’s dot painting and paint-by-grid kits. Perfect DIY art kits for adults and beginners. Start relaxing today!",
  openGraph: {
    title: "Dot Painting & Grid Art Kits | DIY Art Kits | Pictoru",
    description: "Unwind and get creative with Pictoru’s dot painting and paint-by-grid kits. Perfect DIY art kits for adults and beginners. Start relaxing today!",
    url: "https://pictoru.com",
    siteName: "Pictoru",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dot Painting & Grid Art Kits | DIY Art Kits | Pictoru",
    description: "Unwind and get creative with Pictoru’s dot painting and paint-by-grid kits. Perfect DIY art kits for adults and beginners. Start relaxing today!",
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1687611445923570');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1687611445923570&ev=PageView&noscript=1" alt="" />
        </noscript>
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

        <Testimonials />

        <footer className="border-t border-neutral-200 bg-white p-10 mt-20">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
            <div>
              <h3 className="font-bold text-neutral-900 mb-4 text-lg">Pictoru Collections</h3>
              <ul className="space-y-2 text-neutral-600">
                <li><Link href="/dot-painting-flowers" className="hover:text-purple-600">Dot Painting Flowers</Link></li>
                <li><Link href="/sunflower-dot-painting" className="hover:text-purple-600">Sunflower Dot Painting</Link></li>
                <li><Link href="/butterfly-flower-dot-painting" className="hover:text-purple-600">Butterfly & Flowers Combo</Link></li>
                <li><Link href="/buddha-dot-painting" className="hover:text-purple-600">Buddha Painting Kit</Link></li>
                <li><Link href="/relaxing-dot-painting" className="hover:text-purple-600">Mandala Relaxation Art</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-4 text-lg">Animal & Nature Kits</h3>
              <ul className="space-y-2 text-neutral-600">
                <li><Link href="/cat-dot-painting" className="hover:text-purple-600">Cat Dot Painting</Link></li>
                <li><Link href="/dog-dot-painting" className="hover:text-purple-600">Dog Dot Painting</Link></li>
                <li><Link href="/owl-dot-painting" className="hover:text-purple-600">Owl Dot Painting</Link></li>
                <li><Link href="/eagle-dot-painting" className="hover:text-purple-600">Eagle Dot Painting</Link></li>
                <li><Link href="/dot-painting-butterfly" className="hover:text-purple-600">Butterfly Dot Painting</Link></li>
                <li><Link href="/landscape-dot-painting" className="hover:text-purple-600">Peaceful Landscape</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 mb-4 text-lg">Get Started</h3>
              <ul className="space-y-2 text-neutral-600">
                <li><Link href="/dot-painting-for-beginners" className="hover:text-purple-600">Dot Painting for Beginners</Link></li>
                <li><Link href="/paint-by-grid" className="hover:text-purple-600">Grid Painting Guide</Link></li>
                <li><Link href="/diy-art-kits-for-adults" className="hover:text-purple-600">DIY Art Kits for Adults</Link></li>
                <li><Link href="/custom-photo-dot-painting" className="hover:text-purple-600">Custom Photo Kit</Link></li>
                <li><Link href="/#collection" className="hover:text-purple-600">Browse All Patterns</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto border-t border-neutral-100 pt-6 text-center text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Pictoru. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
