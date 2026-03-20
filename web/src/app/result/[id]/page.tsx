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

  useEffect(() => {
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

  if (!data) return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-neutral-200 border-t-neutral-900 animate-spin"></div>
      <p className="mt-4 text-neutral-500 font-medium">Loading your puzzle...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Your Puzzle is Ready!</h1>
        <p className="text-neutral-600">Download the printable PDF or preview the answer key below.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-sm space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800">Printable Puzzle</h3>
            <div className="aspect-[3/4] bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center overflow-hidden">
              <img src={data.preview_url} alt="Puzzle Preview" className="w-full h-full object-contain p-4 mix-blend-multiply" />
            </div>
            <a 
              href={data.pdf_url} 
              download={`reveal-puzzle-${data.job_id}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 bg-neutral-900 text-white rounded-xl font-medium shadow hover:bg-neutral-800 transition-colors"
            >
              Download PDF
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-800">Answer Key</h3>
            <div className="aspect-[3/4] bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-center overflow-hidden relative group">
              <img src={data.answer_url} alt="Answer Key" className="w-full h-full object-contain p-4 mix-blend-multiply" />
              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-medium px-4 py-2 bg-neutral-900/80 rounded-full text-sm">Solved Pattern</span>
              </div>
            </div>
            <a 
              href={data.answer_url} 
              download={`reveal-answer-${data.job_id}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-4 bg-white text-neutral-900 border border-neutral-200 rounded-xl font-medium shadow-sm hover:bg-neutral-50 transition-colors"
            >
              Download Answer Key PNG
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-neutral-100 flex justify-center">
          <Link href="/create" className="text-neutral-500 hover:text-neutral-900 font-medium transition-colors">
            ← Create another puzzle
          </Link>
        </div>
      </div>
    </div>
  );
}
