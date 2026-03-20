import Link from "next/link";
import { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden duration-300">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 will-change-transform" 
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-neutral-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {product.difficulty}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-neutral-900 leading-tight">{product.title}</h3>
          <span className="font-semibold text-neutral-600">${product.price.toFixed(2)}</span>
        </div>
        <p className="text-neutral-500 text-sm mb-6 flex-1">{product.description}</p>
        
        <Link 
          href={`/checkout/${product.id}`}
          className="w-full text-center py-3 bg-neutral-900 text-white font-medium rounded-xl hover:bg-neutral-800 transition-colors"
        >
          Buy Now
        </Link>
      </div>
    </div>
  );
}
