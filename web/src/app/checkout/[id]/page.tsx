import { notFound } from "next/navigation";
import { readyMadeProducts } from "@/data/products";
import Link from "next/link";

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const product = readyMadeProducts.find(p => p.id === params.id);
  
  if (!product) {
    return notFound();
  }

  // Handle checkout dummy function
  async function handleCheckout(formData: FormData) {
    "use server";
    // In actual implementation, we'd call the backend API to get a Stripe Session URL
    if (product) {
      console.log("Checking out product", product.id);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 md:py-20">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-neutral-100 shadow-xl flex flex-col md:flex-row gap-12">
        
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 shadow-inner relative">
            <img src={product.imageUrl} alt={product.title} className="object-cover w-full h-full" />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {product.difficulty} Difficulty
            </div>
          </div>
        </div>

        {/* Product Details & Form */}
        <div className="w-full md:w-1/2 flex flex-col pt-4">
          <Link href="/#collection" className="text-sm text-neutral-500 hover:text-neutral-900 mb-6 font-medium transition-colors">
            ← Back to Collection
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-2">{product.title}</h1>
          <p className="text-2xl font-semibold text-neutral-500 mb-6">${product.price.toFixed(2)} USD</p>
          
          <div className="prose prose-neutral mb-10 text-neutral-600">
            <p>{product.description}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Instant PDF Download</li>
              <li>• Instructions & Pattern Guide Included</li>
              <li>• High-resolution scalable grids</li>
            </ul>
          </div>

          <div className="mt-auto pt-6 border-t border-neutral-100 space-y-4">
            <p className="text-sm text-neutral-500 text-center">Secure checkout powered by Stripe</p>
            <form action={handleCheckout} className="w-full">
              <button 
                type="submit"
                className="w-full py-4 bg-neutral-900 text-white font-bold text-lg rounded-xl hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Checkout Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
