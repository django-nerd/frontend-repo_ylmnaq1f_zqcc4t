import React from 'react';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to Durood Shareef
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed">
            This is a serene space dedicated to learning and reflection. Explore collections, read, and grow with resources curated to inspire heart and mind.
          </p>
          {/* Slider */}
          <div className="mt-8 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
            <div className="flex whitespace-nowrap animate-[scroll_18s_linear_infinite] text-emerald-800 font-medium">
              <span className="px-6 py-3">Blessings and peace upon the beloved Prophet</span>
              <span className="px-6 py-3">A place for reflection, learning, and remembrance</span>
              <span className="px-6 py-3">Mercy, compassion, and guidance</span>
              <span className="px-6 py-3">Gratitude, patience, and sincerity</span>
              <span className="px-6 py-3">Blessings and peace upon the beloved Prophet</span>
              <span className="px-6 py-3">A place for reflection, learning, and remembrance</span>
            </div>
          </div>
        </div>
        <div>
          <div className="relative rounded-2xl border border-emerald-100 bg-white shadow-sm p-6 h-72 sm:h-80 lg:h-96 grid place-items-center">
            <div className="text-center">
              <div className="text-gray-300 text-6xl font-semibold select-none">Arabic Text</div>
            </div>
            <button
              type="button"
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 focus:outline-none"
              aria-label="Play audio"
            >
              <Play className="h-5 w-5" />
              Play
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}
