"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { GenerateResponse } from "@/lib/api";

export default function SuccessDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<GenerateResponse | null>(null);

  useEffect(() => {
    // For Custom puzzles, data is in session storage.
    // For Ready-Made puzzles, we would usually fetch the static PDF from an S3 bucket or public folder.
    // For this MVP, if it's a ready-made product ID (e.g. "puz-lion"), we just show a hardcoded mock PDF button
    // since we don't have python-generated assets for them yet.
    if (id.startsWith("puz-")) {
       setData({
         job_id: id,
         preview_url: "",
         answer_url: "",
         pdf_url: "/mock-ready-made-puzzle.pdf" // Placeholder
       });
       return;
    }

    const stored = sessionStorage.getItem(`puzzle_${id}`);
    if (stored) {
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
