import React from 'react';
import { Search, Play, Pause } from 'lucide-react';
import { daroods } from './daroodsData';
import { useAudio } from './AudioProvider';

export default function DaroodLibrary() {
  const [query, setQuery] = React.useState('');
  const audio = useAudio();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return daroods;
    return daroods.filter((d) =>
      [d.title, d.urduTitle, d.preview, d.arabic].some((v) => (v || '').toLowerCase().includes(q))
    );
  }, [query]);

  const openDetail = (slug) => {
    window.location.hash = `#/darood/${slug}`;
  };

  const isPlayingSrc = (src) => audio.playing && audio.src === new URL(src, window.location.href).href;

  const onToggle = (d) => {
    if (isPlayingSrc(d.audio)) {
      audio.pause();
    } else {
      audio.play(d.audio, d.title);
    }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Darood Library</h1>
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Daroods (title, Arabic, Urdu)..."
              className="w-full rounded-full border border-gray-200 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div
              key={d.slug}
              className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button onClick={() => openDetail(d.slug)} className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{d.title}</h3>
                    <p className="text-emerald-700 text-sm" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{d.urduTitle}</p>
                  </button>
                </div>
                <button
                  onClick={() => onToggle(d)}
                  className={`shrink-0 inline-flex items-center justify-center rounded-full w-10 h-10 border ${
                    isPlayingSrc(d.audio) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'
                  }`}
                  aria-label={isPlayingSrc(d.audio) ? 'Pause' : 'Play'}
                  title={isPlayingSrc(d.audio) ? 'Pause' : 'Play'}
                >
                  {isPlayingSrc(d.audio) ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
              </div>
              <button onClick={() => openDetail(d.slug)} className="block w-full text-left">
                <p dir="rtl" className="mt-3 text-gray-700 line-clamp-2" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{d.preview}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
