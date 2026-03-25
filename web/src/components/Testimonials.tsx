import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80",
      text: "The grid painting completely helped me unwind after work. The quality of the PDF patterns is incredible!"
    },
    {
      name: "David K.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80",
      text: "I bought the eagle dot painting and it transformed my weekends. Highly recommend the 2-for-1 value."
    },
    {
      name: "Emily R.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
      text: "Such a fun and stress-free craft. Printing it at home meant I could start immediately. Beautiful results."
    }
  ];

  return (
    <section className="bg-neutral-50 py-24 mb-0 mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-neutral-900 mb-4">Loved by Crafters Everywhere</h2>
          <p className="text-xl text-neutral-500">See what our community is creating</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-lg border border-neutral-100 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="flex gap-1 mb-6 text-yellow-400">
                ★★★★★
              </div>
              <p className="text-lg text-neutral-700 italic mb-8 flex-grow">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover shadow-md" />
                <span className="font-bold text-neutral-900">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
