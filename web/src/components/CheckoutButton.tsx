"use client";

import { useState } from "react";

export default function CheckoutButton({ slug, label }: { slug: string, label?: string }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seo", id: slug })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to initiate checkout");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={loading}
      className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
    >
      {loading ? "Redirecting to Secure Checkout..." : (label || "Complete Purchase - $8.99")}
    </button>
  );
}
