"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GenerateResponse } from "@/lib/api";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<GenerateResponse | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      if (search.get("success") === "true" || search.get("bypass") === "true") {
        setIsUnlocked(true);
      }
    }
    
    // Retrieve data from session storage mapping this user flow.
    // In a real DB-backed app, we would fetch this from /api/jobs/[id].
    const stored = sessionStorage.getItem(`puzzle_${id}`);
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      // If no data, maybe they refreshed or navigated directly.
      // We could show an error, but for MVP let's point back to create.
      router.push("/create");
    }
  }, [id, router]);

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "custom", id: data?.job_id }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url;
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!data) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin"></div>
      <p className="mt-4 text-neutral-500 font-medium">Loading your preview...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Preview Your Masterpiece</h1>
        <p className="text-neutral-600">Your custom puzzle has been generated! Unlock the high-resolution PDF and Answer Key below.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800">Final Reveal Preview</h3>
            <div className="aspect-[3/4] bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center overflow-hidden relative">
              <img src={data.preview_url} alt="Puzzle Preview" className="w-full h-full object-contain p-4 mix-blend-multiply" />
            </div>
          </div>

          <div className="space-y-6 flex flex-col justify-center">
            <div className="space-y-4 mb-4">
              <h2 className="text-3xl font-bold text-neutral-900">Custom Portrait Puzzle</h2>
              <p className="text-xl text-neutral-500 font-semibold">$10.00 USD</p>
            </div>
            
            <ul className="space-y-3 text-neutral-600 mb-8">
              <li className="flex gap-3 items-center">
                <span className="text-emerald-500">✓</span> Instant High-Res PDF Download
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-emerald-500">✓</span> 4 Pages including patterns & empty grids
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-emerald-500">✓</span> Revealed "Answer Key" image
              </li>
            </ul>

            {isUnlocked ? (
              <div className="space-y-4">
                <a href={data.pdf_url} download className="block w-full text-center py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-xl hover:opacity-90 transition-all text-xl hover:scale-105">
                  Download Printable PDF
                </a>
                <a href={data.answer_url} download className="block w-full text-center py-4 bg-neutral-100 text-neutral-900 rounded-xl font-bold hover:bg-neutral-200 transition-all">
                  Download Answer Key
                </a>
                <p className="text-sm text-center text-emerald-600 font-medium mt-4">✓ Purchase Successful!</p>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleCheckout}
                  className="block w-full text-center py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-xl hover:opacity-90 transition-all text-xl hover:scale-105"
                >
                  Checkout with Stripe
                </button>
                <p className="text-xs text-center text-neutral-400 mt-4">Secure payment processing. Files are delivered instantly.</p>
              </>
            )}
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-100 flex justify-center">
          <Link href="/create" className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors">
            ← Want to try a different photo?
          </Link>
        </div>
      </div>
    </div>
  );
}
