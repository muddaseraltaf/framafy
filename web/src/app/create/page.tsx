"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { generatePuzzle } from "@/lib/api";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

export default function CreatePuzzle() {
  const router = useRouter();
  
  // File & Crop States
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  
  // Cropper UI States
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  // Metadata States
  const [orientation, setOrientation] = useState("portrait");
  const [title, setTitle] = useState("Reveal Your Photo Puzzle");
  const [subtitle, setSubtitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    validateAndLoadFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    validateAndLoadFile(dropped);
  };

  const validateAndLoadFile = (selected?: File) => {
    if (selected && selected.type.startsWith("image/")) {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      if (!validTypes.includes(selected.type)) {
        setError("Unsupported file format. Please upload a standard JPG, PNG, or WEBP image.");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setShowCropper(true); // Open cropper immediately
      setError(null);
    } else {
      setError("Please select a valid image file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const resolveCrop = async () => {
    if (!preview || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(preview, croppedAreaPixels, 0);
      if (croppedBlob) {
        setCroppedFile(croppedBlob);
        setCroppedPreview(URL.createObjectURL(croppedBlob));
        setShowCropper(false);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to crop image.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!croppedFile) {
      setError("Please upload and crop an image first.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await generatePuzzle(croppedFile, title, subtitle, orientation);
      sessionStorage.setItem(`puzzle_${result.job_id}`, JSON.stringify(result));
      router.push(`/result/${result.job_id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 relative">
      <h1 className="text-4xl font-bold mb-2">Create Your Puzzle</h1>
      <p className="text-neutral-600 mb-8">Upload and frame your photo to generate your custom printable puzzle.</p>

      {/* Cropper Modal */}
      {showCropper && preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden flex flex-col h-[85vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Crop Your Masterpiece</h3>
                <p className="text-sm text-neutral-500">Drag and zoom to perfectly frame your subject.</p>
              </div>
              <button onClick={() => setShowCropper(false)} className="text-neutral-400 hover:text-black">✕ Close</button>
            </div>
            
            {/* Cropper Settings */}
            <div className="p-4 bg-neutral-50 border-b flex gap-4 justify-center">
              <button 
                onClick={() => setOrientation("portrait")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${orientation === "portrait" ? "bg-black text-white" : "bg-white border text-black"}`}
              >
                Portrait (3:4)
              </button>
              <button 
                onClick={() => setOrientation("landscape")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${orientation === "landscape" ? "bg-black text-white" : "bg-white border text-black"}`}
              >
                Landscape (4:3)
              </button>
            </div>

            <div className="relative flex-grow bg-neutral-100">
              <Cropper
                image={preview}
                crop={crop}
                zoom={zoom}
                aspect={orientation === "portrait" ? 3 / 4 : 4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="p-6 bg-white border-t flex items-center justify-between">
              <div className="flex items-center gap-4 w-1/2">
                <span className="text-sm font-medium">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <button 
                onClick={resolveCrop}
                className="px-8 py-3 bg-black text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
              >
                Confirm Crop
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
        
        {/* File Upload Section */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
            croppedPreview ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
          }`}
          onClick={() => !croppedPreview && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleFileChange} 
          />
          
          {croppedPreview ? (
            <div className="relative inline-block w-full max-w-sm">
              <img src={croppedPreview} alt="Cropped Preview" className="w-full rounded-xl shadow-md border" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button 
                  type="button" 
                  className="bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCropper(true);
                  }}
                >
                  Adjust Framing
                </button>
                <button 
                  type="button" 
                  className="bg-red-500 text-white w-8 h-8 rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                    setCroppedFile(null);
                    setCroppedPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-neutral-700">Click to upload or drag & drop</p>
              <p className="text-sm text-neutral-500">Supported: JPG, PNG, WEBP (No AVIF/HEIC)</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-6">
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
            disabled={isSubmitting || !croppedFile}
            className={`px-8 py-4 rounded-xl font-medium transition-all ${
              isSubmitting || !croppedFile
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-neutral-800 shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {isSubmitting ? 'Generating Detail Puzzle...' : 'Generate Puzzle'}
          </button>
        </div>

      </form>
    </div>
  );
}
