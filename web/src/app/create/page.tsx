"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generatePuzzle } from "@/lib/api";

export default function CreatePuzzle() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState("medium");
  const [orientation, setOrientation] = useState("portrait");

  const [title, setTitle] = useState("Reveal Your Photo Puzzle");
  const [subtitle, setSubtitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type.startsWith("image/")) {
      setFile(selected);
      // Create local preview
      const objectUrl = URL.createObjectURL(selected);
      setPreview(objectUrl);
      setError(null);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith("image/")) {
      setFile(dropped);
      const objectUrl = URL.createObjectURL(dropped);
      setPreview(objectUrl);
      setError(null);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("An image is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await generatePuzzle(file, gridSize, title, subtitle, orientation);
      
      // We will pass the URLs to the result page via sessionStorage for MVP simplicity,
      // since there is no database storing the job objects right now.
      sessionStorage.setItem(`puzzle_${result.job_id}`, JSON.stringify(result));
      
      router.push(`/result/${result.job_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-2">Create Your Puzzle</h1>
      <p className="text-neutral-600 mb-8">Upload a photo to generate your custom printable puzzle pattern.</p>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
        
        {/* File Upload Section */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            preview ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
          }`}
          onClick={() => !preview && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
          
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-sm object-contain" />
              <button 
                type="button" 
                className="absolute -top-3 -right-3 bg-white text-neutral-800 rounded-full w-8 h-8 shadow-md border border-neutral-200 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-neutral-700">Click to upload or drag & drop</p>
              <p className="text-sm text-neutral-500">SVG, PNG, JPG or WEBP</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuration Options */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Grid Detail Level</label>
              <div className="grid grid-cols-3 gap-3">
                {["easy", "medium", "detailed"].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setGridSize(level)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                      gridSize === level 
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' 
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Orientation</label>
              <div className="grid grid-cols-2 gap-3">
                {["portrait", "landscape"].map((val) => (
                  <button
                    key={val} type="button" onClick={() => setOrientation(val)}
                    className={`py-3 rounded-xl border text-sm font-medium transition-all capitalize ${
                      orientation === val ? 'border-neutral-900 bg-neutral-900 text-white shadow-md' : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Puzzle Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all font-medium"
                placeholder="e.g. For Amna"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Subtitle / Instructions (Optional)</label>
              <input 
                type="text" 
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                placeholder="Color in the grid using the pattern guide!"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting || !file}
            className={`px-8 py-4 rounded-xl font-medium transition-all ${
              isSubmitting || !file
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'Generating Puzzle...' : 'Generate Puzzle'}
          </button>
        </div>

      </form>
    </div>
  );
}
