"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ARResultPage() {
  const params = useParams();
  const ar_id = params?.id as string;
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (ar_id) {
      // The API saves the QR in the public outputs directory
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      setQrUrl(`${baseUrl}/outputs/${ar_id}/qrcode.png`);
    }
  }, [ar_id]);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Your AR Gift is Ready! 🎈</h1>
        <p className="text-xl text-neutral-600">Print the code below or scan it directly from another device.</p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-neutral-100 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">How to use your AR Gift:</h3>
            <ul className="space-y-4 text-lg text-neutral-600">
              <li className="flex gap-4">
                <span className="text-2xl">📱</span>
                <p><strong>Open your phone camera</strong> and scan the QR code.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">📸</span>
                <p><strong>Allow Camera Access</strong> on the pop-up browser tab.</p>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">🎂</span>
                <p><strong>Point your phone</strong> back at the printed QR code (e.g. on a birthday cake or greeting card).</p>
              </li>
              <li className="flex gap-4">
                <span className="text-2xl">✨</span>
                <p>Watch as realistic balloons float up carrying your photos!</p>
              </li>
            </ul>
            
            <div className="pt-6">
              <p className="text-sm text-neutral-500 mb-2">Want to test it right now?</p>
              <p className="font-medium text-purple-600">Just scan the screen with your smartphone!</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200">
            {qrUrl ? (
              <img src={qrUrl} alt="AR Target Payload" className="w-full max-w-[280px] aspect-square rounded-2xl shadow-sm mix-blend-multiply" />
            ) : (
              <div className="w-full max-w-[280px] aspect-square bg-neutral-200 animate-pulse rounded-2xl" />
            )}
            
            <div className="mt-8 space-y-4 w-full">
              <a 
                href={qrUrl || "#"} 
                download={`AR-Marker-${ar_id}.png`}
                className="block w-full text-center py-4 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
              >
                Download Marker to Print
              </a>
            </div>
          </div>

        </div>
      </div>
      
      <div className="mt-10 text-center">
        <Link href="/ar-gift" className="text-neutral-500 font-medium hover:text-black">
          &larr; Create another AR gift
        </Link>
      </div>
    </div>
  );
}
