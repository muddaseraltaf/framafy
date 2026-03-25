"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ARGiftUploader() {
  const router = useRouter();
  
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setError("Please upload strictly image files (JPG, PNG).");
      return;
    }
    
    setFiles(prev => {
      const combined = [...prev, ...validFiles].slice(0, 10);
      setPreviews(combined.map(f => URL.createObjectURL(f)));
      return combined;
    });
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setError("Please upload at least 1 photo.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("photos", f));
      formData.append("frontend_url", window.location.origin);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      
      const response = await fetch(`${baseUrl}/api/ar/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload photos.");
      
      const result = await response.json();
      router.push(`/ar/result/${result.ar_id}`);
    } catch (err: any) {
      setError(err.message || "Failed to generate AR Experience.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 relative">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-6 pb-2">
          AR Photo Balloons
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
          Attach your favorite memories to 3D floating balloons! Upload up to 10 photos, scan the generated QR code, and watch them float in your living room or above a birthday cake.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3rem] shadow-xl border border-neutral-100">
        <div 
          className="border-2 border-dashed border-purple-200 rounded-[2rem] p-12 text-center cursor-pointer hover:bg-purple-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            multiple
            onChange={handleFileChange} 
          />
          
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-3xl">
              📸
            </div>
            <h3 className="text-2xl font-bold text-neutral-900">Upload 1 to 10 Photos</h3>
            <p className="text-neutral-500">Drag and drop your memories here, or click to browse</p>
          </div>
        </div>

        {previews.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center px-2">
              <h4 className="font-bold text-neutral-800">Your Float Gallery ({previews.length}/10)</h4>
              <button 
                type="button"
                onClick={() => { setFiles([]); setPreviews([]); }}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs font-bold shadow-md hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        <div className="mt-10 flex flex-col items-center">
          <button 
            type="submit" 
            disabled={isSubmitting || files.length === 0}
            className={`w-full md:w-auto px-12 py-5 rounded-full font-bold text-lg transition-all ${
              isSubmitting || files.length === 0
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
            }`}
          >
            {isSubmitting ? 'Creating 3D Experience...' : 'Generate My AR Target'}
          </button>
          <p className="text-neutral-400 text-sm mt-4">100% Free. No app required to view.</p>
        </div>
      </form>
    </div>
  );
}
