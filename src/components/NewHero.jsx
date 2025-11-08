import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useAudio } from './AudioProvider';

const ARABIC_IBRAHIMI = `اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ`;

export default function NewHero() {
  const audio = useAudio();
  const src = '/audio/darood-ibrahimi.mp3';
  const isPlaying = audio.playing && audio.src === new URL(src, window.location.href).href;

  const onToggle = () => {
    audio.toggle(src, 'Durood-e-Ibrahimi');
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid gap-10 items-start lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Welcome to Durood Shareef</h1>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            A blessed Islamic platform for Durood, Quran, Hadith, Duas, Prayer Times, Islamic Calendar, and more.
          </p>
          <div className="mt-8 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
            <div className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite] text-emerald-800 font-medium" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
              <span className="px-6 py-3">{ARABIC_IBRAHIMI}</span>
              <span className="px-6 py-3">{ARABIC_IBRAHIMI}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative rounded-2xl border border-emerald-100 bg-white shadow-sm p-6 w-full h-72 sm:h-80 lg:h-96 grid place-items-center">
            <div className="text-center">
              <p dir="rtl" className="text-3xl leading-relaxed text-gray-900 px-4" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{ARABIC_IBRAHIMI}</p>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 focus:outline-none"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
