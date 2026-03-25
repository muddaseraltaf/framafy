"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GenerateResponse } from "@/lib/api";
import { landingPages } from "@/data/landingPages";

export default function SuccessDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<GenerateResponse | null>(() => {
    if (typeof window !== 'undefined') {
      if (id.startsWith("puz-")) {
        return { job_id: id, preview_url: "", answer_url: "", pdf_url: "/mock-ready-made-puzzle.pdf" };
      }
      const seoPage = landingPages.find(p => p.slug === id);
      if (seoPage) {
        return {
          job_id: id,
          preview_url: seoPage.imageUrl || "", 
          answer_url: `/downloads/${id}/answer_key.png`,
          pdf_url: `/downloads/${id}/puzzle.pdf`
        };
      }
    }
    return null;
  });

  useEffect(() => {
    if (id.startsWith("puz-")) return;
    const isSEOMade = landingPages.some(p => p.slug === id);
    if (isSEOMade) return;

    const stored = sessionStorage.getItem(`puzzle_${id}`);
    if (stored) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setData(JSON.parse(stored));
    } else {
      router.push("/");
    }
  }, [id, router]);

  if (!data) return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-emerald-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-neutral-600">Your pristine, high-resolution puzzle is ready to be printed.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm text-center space-y-8">
        
        <div className="max-w-md mx-auto space-y-4 pt-6">
          <a 
            href={data.pdf_url} 
            download={`reveal-puzzle-${data.job_id}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-5 bg-neutral-900 text-white rounded-xl font-bold shadow-xl hover:bg-neutral-800 transition-all text-xl hover:scale-105"
          >
            Download Printable PDF
          </a>
          
          {data.answer_url && (
            <a 
              href={data.answer_url} 
              download={`reveal-answer-${data.job_id}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-white text-neutral-900 border-2 border-neutral-200 rounded-xl font-medium shadow-sm hover:bg-neutral-50 transition-colors"
            >
              Download Answer Key
            </a>
          )}
        </div>

        <div className="pt-10 flex justify-center">
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
