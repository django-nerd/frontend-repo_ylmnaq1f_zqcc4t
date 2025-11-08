import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useAudio } from './AudioProvider';

const API = 'https://api.alquran.cloud/v1';

function useLocalStorage(key, initialValue) {
  const [state, setState] = React.useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initialValue; } catch { return initialValue; }
  });
  React.useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

export default function Quran() {
  const audio = useAudio();
  const [surahs, setSurahs] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [currentSurah, setCurrentSurah] = React.useState(null);
  const [arabicAyahs, setArabicAyahs] = React.useState([]);
  const [audioAyahs, setAudioAyahs] = React.useState([]);
  const [translationAyahs, setTranslationAyahs] = React.useState([]);
  const [translation, setTranslation] = React.useState('none'); // none | en.asad | ur.jalandhry
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [currentIdx, setCurrentIdx] = React.useState(-1);
  const [autoAdvance, setAutoAdvance] = useLocalStorage('q_auto_advance', true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/surah`);
        const data = await res.json();
        const list = data?.data || [];
        setSurahs(list);
        setFiltered(list);
        setCurrentSurah(list[0]);
      } catch {
        setError('Failed to load surah list');
      }
    };
    load();
  }, []);

  React.useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(surahs);
    setFiltered(
      surahs.filter((s) => s.englishName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || String(s.number).includes(q))
    );
  }, [query, surahs]);

  React.useEffect(() => {
    if (!currentSurah) return;
    const load = async () => {
      setLoading(true); setError(''); setCurrentIdx(-1);
      try {
        const [arRes, audRes] = await Promise.all([
          fetch(`${API}/surah/${currentSurah.number}`),
          fetch(`${API}/surah/${currentSurah.number}/ar.alafasy`),
        ]);
        const ar = await arRes.json();
        const aud = await audRes.json();
        setArabicAyahs(ar?.data?.ayahs || []);
        setAudioAyahs(aud?.data?.ayahs || []);
        if (translation !== 'none') {
          const tRes = await fetch(`${API}/surah/${currentSurah.number}/${translation}`);
          const t = await tRes.json();
          setTranslationAyahs(t?.data?.ayahs || []);
        } else {
          setTranslationAyahs([]);
        }
      } catch {
        setError('Failed to load surah data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentSurah, translation]);

  // Handle auto-advance using global audio element
  React.useEffect(() => {
    const el = audio.audioEl();
    const onEnded = () => {
      if (!autoAdvance) return;
      if (currentIdx < 0) return;
      const next = currentIdx + 1;
      if (next < audioAyahs.length) {
        startFrom(next);
      }
    };
    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
  }, [autoAdvance, currentIdx, audioAyahs.length]);

  const startFrom = async (idx) => {
    const a = audioAyahs[idx];
    if (!a || !a.audio) return;
    try {
      await audio.play(a.audio, `${currentSurah.englishName} • Ayah ${idx + 1}`);
      setCurrentIdx(idx);
      // Scroll into view
      const el = document.getElementById(`ayah-${idx}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
      // skip to next on failure
      const next = idx + 1;
      if (next < audioAyahs.length) startFrom(next);
    }
  };

  const toggleAyah = (idx) => {
    const a = audioAyahs[idx];
    if (!a || !a.audio) return;
    const sameSrc = audio.src === new URL(a.audio, window.location.href).href;
    if (sameSrc && audio.playing) {
      audio.pause();
    } else {
      startFrom(idx);
    }
  };

  const isCurrent = (idx) => currentIdx === idx && audio.playing;

  const onPrev = () => {
    if (currentIdx > 0) startFrom(currentIdx - 1);
  };
  const onNext = () => {
    const next = (currentIdx < 0 ? 0 : currentIdx + 1);
    if (next < audioAyahs.length) startFrom(next);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <aside className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4 h-[70vh] lg:h-[80vh] overflow-hidden flex flex-col">
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Surah"
              className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="mt-3 overflow-auto pr-2">
            {filtered.map((s) => (
              <button
                key={s.number}
                onClick={() => setCurrentSurah(s)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-emerald-50 ${
                  currentSurah && currentSurah.number === s.number ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{s.englishName}</span>
                  <span className="text-gray-500">{s.number}</span>
                </div>
                <div className="text-xs text-gray-500">{s.englishNameTranslation}</div>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-h-[70vh]">
          {currentSurah && (
            <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentSurah.englishName} <span className="text-gray-500 font-normal">({currentSurah.name})</span>
                  </h1>
                  <p className="text-sm text-gray-600">{currentSurah.englishNameTranslation} • {currentSurah.revelationType} • {currentSurah.numberOfAyahs} ayahs</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={onPrev} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700">
                    <SkipBack className="h-4 w-4" /> Prev
                  </button>
                  <button onClick={() => (currentIdx >= 0 ? audio.toggle(audio.src, '') : startFrom(0))} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${audio.playing ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    {audio.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {audio.playing ? 'Pause' : 'Play'}
                  </button>
                  <button onClick={onNext} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700">
                    Next <SkipForward className="h-4 w-4" />
                  </button>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} /> Auto-advance ayahs
                  </label>
                  <select
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="rounded-md border border-emerald-200 px-2 py-1 text-sm"
                  >
                    <option value="none">No translation</option>
                    <option value="en.asad">English (Asad)</option>
                    <option value="ur.jalandhry">Urdu (Jalandhri)</option>
                  </select>
                </div>
              </div>

              {loading && <div className="mt-6 text-gray-600">Loading surah...</div>}
              {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

              {!loading && !error && (
                <div className="mt-6 space-y-6 max-h-[70vh] overflow-auto pr-2">
                  {arabicAyahs.map((a, idx) => (
                    <div key={a.number} id={`ayah-${idx}`} className={`rounded-lg border p-4 ${isCurrent(idx) ? 'border-emerald-400 bg-emerald-50/50' : 'border-emerald-100'}`}>
                      <div dir="rtl" className="text-2xl leading-loose text-gray-900" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
                        <span className="align-middle">{a.text}</span>
                        <span className="ml-2 text-emerald-700 text-base">﴿{a.numberInSurah}﴾</span>
                      </div>
                      {translation !== 'none' && translationAyahs[idx] && (
                        <div className="mt-2 text-gray-700 text-sm">{translationAyahs[idx].text}</div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => toggleAyah(idx)}
                          className={`rounded-full px-3 py-1.5 text-sm shadow-sm border ${
                            isCurrent(idx) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isCurrent(idx) ? 'Pause' : 'Play'}
                        </button>
                        <button
                          onClick={() => startFrom(idx)}
                          className="rounded-full px-3 py-1.5 text-sm shadow-sm border bg-white text-gray-700 border-emerald-200"
                        >
                          Play from here
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
