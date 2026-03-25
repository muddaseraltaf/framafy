import { notFound } from "next/navigation";
import { landingPages } from "@/data/landingPages";
import { Metadata } from "next";
import Link from "next/link";

export async function generateStaticParams() {
  return landingPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const page = landingPages.find(p => p.slug === resolvedParams.slug);
  
  if (!page) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      images: [page.imageUrl || ""],
    }
  };
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const page = landingPages.find(p => p.slug === resolvedParams.slug);

  if (!page) {
    return notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I get both versions with one purchase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! For just $8.99, you receive both the dot painting and grid painting PDF formats."
        }
      },
      {
        "@type": "Question",
        "name": "Is this beginner friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely. It is designed specifically for beginners to easily create beautiful artwork without stress."
        }
      }
    ]
  };

  // Basic markdown parser for bold tags and paragraphs
  const parsedContent = "<p>" + page.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>') + "</p>";

  return (
    <div className="flex flex-col space-y-20 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Hero Section */}
      <section className="text-center space-y-10 max-w-5xl mx-auto pt-10 px-4">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 leading-[1.1]">
            {page.headline}
          </h1>
          <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed font-light max-w-3xl mx-auto">
            {page.subheadline}
          </p>
        </div>
        
        <div className="flex justify-center pt-2 pb-8">
          <Link 
            href="/create" 
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:-translate-y-1 transition-all"
          >
            {page.cta || "Get Both Versions Now - $8.99"}
          </Link>
        </div>

        <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] md:aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-200/50">
          <img 
            src={page.imageUrl} 
            alt={page.metaTitle} 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 mb-6">{page.h1}</h2>
          <p className="text-xl font-medium text-purple-700 bg-purple-50 inline-block px-6 py-3 rounded-2xl">{page.shortDescription}</p>
        </div>
        
        <div 
          dangerouslySetInnerHTML={{ __html: parsedContent }} 
          className="prose prose-lg prose-neutral max-w-none text-neutral-600 leading-relaxed space-y-6 [&>p]:mb-6"
        />
      </section>

      {/* Value Prop Banner */}
      <section className="bg-neutral-50 rounded-[3rem] p-10 md:p-16 text-center space-y-8 max-w-5xl mx-auto mx-4">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">What You Get: Unbeatable Value</h2>
        <ul className="text-lg text-neutral-600 font-medium flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 list-none p-0">
          <li className="flex items-center gap-2">✨ Dot Painting Format</li>
          <li className="flex items-center gap-2">✨ Grid Painting Format</li>
          <li className="flex items-center gap-2">✨ Instant PDF Download</li>
        </ul>
        <Link 
          href="/create" 
          className="inline-block mt-4 px-10 py-4 bg-neutral-900 text-white font-bold rounded-full hover:bg-neutral-800 transition-colors"
        >
          {page.cta || "Buy Once, Paint Two Ways"}
        </Link>
      </section>
    </div>
  );
}
