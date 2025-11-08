import React from 'react';
import { Play, Pause } from 'lucide-react';

const ARABIC_TEXT = `اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ`;

export default function Hero() {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnd = () => setPlaying(false);
    el.addEventListener('ended', onEnd);
    return () => el.removeEventListener('ended', onEnd);
  }, []);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Welcome to Durood Shareef
          </h1>
          <p className="mt-4 text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
            A blessed Islamic platform dedicated to Salat-o-Salam upon Prophet Muhammad ﷺ. Explore the Durood Library, read the Holy Quran, authentic Hadiths, Duas, Prayer Times, Islamic Books, and useful Islamic tools.
          </p>
          <div className="mt-8 overflow-hidden rounded-lg border border-emerald-100 bg-emerald-50">
            <div className="flex whitespace-nowrap animate-[scroll_25s_linear_infinite] text-emerald-800 font-medium" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
              <span className="px-6 py-3">{ARABIC_TEXT}</span>
              <span className="px-6 py-3">{ARABIC_TEXT}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative rounded-2xl border border-emerald-100 bg-white shadow-sm p-6 w-full h-72 sm:h-80 lg:h-96 grid place-items-center">
            <div className="text-center">
              <p dir="rtl" className="text-3xl leading-relaxed text-gray-900 px-4" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
                {ARABIC_TEXT}
              </p>
            </div>
            <button
              type="button"
              onClick={togglePlay}
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-white shadow-lg hover:bg-emerald-700 focus:outline-none"
              aria-label="Play audio"
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {playing ? 'Pause' : 'Play'}
            </button>
            {/* Prefer local path if present; fallback to example link */}
            <audio ref={audioRef} src={getHeroAudioSrc()} preload="none" />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </section>
  );
}

function getHeroAudioSrc() {
  // Use local file path as requested; can be served from public/audio
  const local = '/audio/darood-ibrahimi.mp3';
  // Fallback sample if local asset is not available in this environment
  const fallback = 'https://example.com/audio/darood-ibrahimi.mp3';
  return local || fallback;
}
