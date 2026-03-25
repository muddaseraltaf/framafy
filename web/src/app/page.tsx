import Link from "next/link";
import { readyMadeProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is dot painting easier than diamond painting?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Dot painting kits use premium liquid paints instead of tiny plastic drills that easily spill. It's a cleaner, more modern alternative that is beginner-friendly and incredibly relaxing."
        }
      },
      {
        "@type": "Question",
        "name": "What is included in a paint-by-grid kit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every Pictoru grid painting kit includes a high-quality pre-printed canvas grid, perfectly curated colors, instructions, and all the tools you need to create your own pixel painting masterpiece."
        }
      }
    ]
  };

  return (
    <div className="flex flex-col space-y-32 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-5xl mx-auto pt-10 px-4">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-neutral-900 leading-[1.1]">
            Create Beautiful Art, <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">One Dot at a Time.</span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light max-w-3xl mx-auto">
            Discover modern dot painting and grid-based art kits designed for total beginners. Unwind, focus, and easily craft your own masterpiece—no experience needed.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-2 pb-8">
          <Link 
            href="/create" 
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Shop Beginner Kits
          </Link>
          <Link 
            href="/#collection" 
            className="w-full sm:w-auto px-10 py-5 bg-white text-neutral-900 font-bold text-lg rounded-full border-2 border-neutral-200 hover:border-purple-300 hover:text-purple-700 transition-all"
          >
            Explore our Dot Painting Collection
          </Link>
        </div>

        <div className="relative w-full max-w-2xl mx-auto aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-200/50">
          <img 
            src="/product-shot-1.jpg" 
            alt="woman relaxing at home using a butterfly dot painting kit for beginners" 
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>

      {/* SEO Introduction */}
      <section className="max-w-4xl mx-auto text-center px-4 space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Unleash Your Creativity with Modern DIY Art Kits</h2>
        <p className="text-lg text-neutral-600 leading-relaxed font-light">
          Welcome to Pictoru, your new favorite way to disconnect from screens and reconnect with your creativity. Whether you&apos;re looking for a relaxing weekend activity or a unique gift, our <strong>DIY art kits for adults</strong> make it incredibly simple to create stunning artwork from scratch. We specialize in two mindful, beginner-friendly art forms: dot painting and paint-by-grid art. No messy paints, no complicated instructions—just pure, relaxing creativity.
        </p>
      </section>

      {/* Ready-Made Collection */}
      <section id="collection" className="space-y-12">
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 mb-4">Dot Painting Kits for Beginners</h2>
          <p className="text-xl text-neutral-500 font-light">Find beginner kits that are easy, relaxing, and ready-to-print.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {readyMadeProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center text-lg text-neutral-600 font-light max-w-3xl mx-auto">
          If you love diamond painting but want something cleaner and more modern, you will fall in love with our dot painting kits. <Link href="/#collection" className="text-purple-600 font-medium hover:underline">Explore our dot painting collection</Link> to start your journey. <strong>Dot art for beginners</strong> has never been more accessible!
        </div>
      </section>

      {/* Grid Painting Info */}
      <section className="bg-neutral-50 rounded-[3rem] p-10 md:p-16 text-center space-y-8">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Discover Paint by Grid Art</h2>
        <p className="text-lg text-neutral-600 leading-relaxed font-light max-w-3xl mx-auto">
          Looking for something with a modern, pixelated edge? Our <strong>pixel painting kits</strong> and grid-based art designs are the perfect match. <strong>Paint by grid</strong> is an innovative take on traditional paint-by-numbers. Instead of organic shapes, your canvas is divided into a high-quality grid system. By following the simple, color-coded instructions, you fill in the grid square by square. As you work, a detailed, vibrant image slowly emerges.
        </p>
        <Link href="/create" className="inline-block mt-4 text-purple-600 font-bold hover:underline font-medium">
          Browse our grid painting collection &rarr;
        </Link>
      </section>

      {/* Custom Portrait Banner */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 rounded-[3rem] p-12 md:p-16 text-white shadow-2xl overflow-hidden relative mx-4 lg:mx-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Pictoru Over Traditional Craft Kits?</h2>
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold text-pink-200">Everything You Need in One Box</h3>
              <p className="text-lg text-pink-100 font-light leading-relaxed">
                We believe that art should be accessible to everyone, regardless of skill level. Many traditional craft kits are overwhelming, overly complicated, or result in artwork that feels dated. Pictoru is different. We design our dot painting kits exclusively with modern aesthetics in mind.
              </p>
            </div>
            <Link 
              href="/create" 
              className="inline-block px-10 py-5 bg-white text-purple-900 font-bold text-lg rounded-full hover:bg-pink-50 transition-all shadow-xl hover:scale-105"
            >
              Start Your Masterpiece
            </Link>
          </div>
          
          <div className="w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/product-shot-2.jpg" 
              alt="colorful flower pixel grid painting art kit laid out on a wooden table" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-4xl mx-auto space-y-12 pb-10 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">Relaxing DIY Art Kits for Adults: The Benefits</h2>
          <h3 className="text-xl text-neutral-600 font-medium">Perfect for Stress Relief and Mindfulness</h3>
        </div>
        
        <div className="text-lg text-neutral-600 leading-relaxed font-light space-y-6">
          <p>
            Creating art isn&apos;t just about the final product; it’s about the journey. Our kits are intentionally designed to promote mindfulness and stress relief. Engaging in repetitive, focused activities like dotting or filling in a grid requires just enough attention to quiet racing thoughts, but not enough to cause mental fatigue.
          </p>
          <p>
            It is a form of active meditation. Taking just 30 minutes a day to work on your Pictoru canvas can significantly lower stress levels, improve concentration, and boost your mood. Give yourself the gift of a creative break as an <Link href="/" className="text-purple-600 hover:underline">alternative to diamond painting</Link>, and discover why thousands are turning to Pictoru for their daily dose of relaxation.
          </p>
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
            <p className="text-neutral-600 text-lg font-light leading-relaxed">Select one of our meticulously crafted masterpieces from the collection, or upload your own favorite photo to easily create modern DIY art kits for adults.</p>
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
