import Link from "next/link";
import { readyMadeProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex flex-col space-y-32 py-10">
      
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-3xl mx-auto pt-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-neutral-900 leading-[1.1]">
          Uncover the <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">hidden art.</span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light">
          Experience the magic of revealing stunning, photorealistic art—one pattern at a time. Perfect for gifting, relaxing, or creating beautiful wall decor.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
          <Link 
            href="/#collection" 
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Shop Collection
          </Link>
          <Link 
            href="/create" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-900 font-medium rounded-full border border-neutral-200 hover:border-purple-300 hover:text-purple-700 transition-all"
          >
            Upload Custom Photo
          </Link>
        </div>
      </section>

      {/* Ready-Made Collection */}
      <section id="collection" className="space-y-12">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">The Masterpiece Collection</h2>
          <p className="text-xl text-neutral-500 font-light">Ready-to-print puzzles carefully designed for the perfect reveal.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {readyMadeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Custom Portrait Banner */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 rounded-[3rem] p-12 md:p-20 text-center text-white space-y-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Turn your memories into handmade art.</h2>
          <p className="text-xl text-pink-100 font-light">Upload any photo of a loved one, pet, or scenery and our engine will instantly generate a 6-pattern puzzle for you to solve.</p>
          <Link 
            href="/create" 
            className="inline-block px-10 py-5 bg-white text-purple-900 font-bold rounded-full hover:bg-pink-50 transition-all shadow-xl hover:scale-105"
          >
            Start Your Custom Puzzle
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-16 pb-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">How it works</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-900 font-black rounded-2xl flex items-center justify-center text-2xl shadow-sm">1</div>
            <h3 className="text-2xl font-bold text-neutral-900">Choose or Upload</h3>
            <p className="text-neutral-600 text-lg font-light leading-relaxed">Select one of our meticulously crafted masterpieces from the collection, or upload your own favorite photo.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-900 font-black rounded-2xl flex items-center justify-center text-2xl shadow-sm">2</div>
            <h3 className="text-2xl font-bold text-neutral-900">Print the PDF</h3>
            <p className="text-neutral-600 text-lg font-light leading-relaxed">Instantly download an A4 printable PDF containing your blank grid and the pattern instruction guide.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-neutral-100 text-neutral-900 font-black rounded-2xl flex items-center justify-center text-2xl shadow-sm">3</div>
            <h3 className="text-2xl font-bold text-neutral-900">Follow the Patterns</h3>
            <p className="text-neutral-600 text-lg font-light leading-relaxed">Use a standard black pen to fill in the grid according to the 6 shapes. The photorealistic image will slowly reveal itself to the amazement of everyone watching.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
