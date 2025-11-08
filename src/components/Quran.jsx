import React from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

function useLocalStorage(key, initialValue) {
  const [state, setState] = React.useState(() => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : initialValue;
    } catch {
      return initialValue;
    }
  });
  React.useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

export default function Quran() {
  const [surahs, setSurahs] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [currentSurah, setCurrentSurah] = React.useState(null);
  const [arabicAyahs, setArabicAyahs] = React.useState([]);
  const [translationAyahs, setTranslationAyahs] = React.useState([]);
  const [translation, setTranslation] = React.useState('none'); // none | en.asad | ur.jalandhry
  const [audioAyahs, setAudioAyahs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [playingAyah, setPlayingAyah] = React.useState(null);
  const audioRef = React.useRef(null);
  const [bookmarks, setBookmarks] = useLocalStorage('quran_bookmarks', {}); // {"2-255": true}

  React.useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/quran/surahs`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSurahs(data);
          setFiltered(data);
          setCurrentSurah(data[0]);
        } else {
          setError('Failed to load surah list');
        }
      } catch (e) {
        setError('Failed to load surah list');
      }
    };
    fetchSurahs();
  }, []);

  React.useEffect(() => {
    if (!currentSurah) return;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [arRes, audioRes] = await Promise.all([
          fetch(`${API_BASE}/api/quran/surah/${currentSurah.number}`),
          fetch(`${API_BASE}/api/quran/surah/${currentSurah.number}/audio`),
        ]);
        const ar = await arRes.json();
        const aud = await audioRes.json();
        if (ar?.ayahs) setArabicAyahs(ar.ayahs);
        if (aud?.ayahs) setAudioAyahs(aud.ayahs);
        if (translation !== 'none') {
          const tRes = await fetch(`${API_BASE}/api/quran/surah/${currentSurah.number}/translation/${translation}`);
          const t = await tRes.json();
          if (t?.ayahs) setTranslationAyahs(t.ayahs);
        } else {
          setTranslationAyahs([]);
        }
      } catch (e) {
        setError('Failed to load surah data');
      } finally {
        setLoading(false);
      }
    };
    load();
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingAyah(null);
    }
  }, [currentSurah, translation]);

  React.useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(surahs);
    setFiltered(
      surahs.filter((s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        String(s.number).includes(q)
      )
    );
  }, [query, surahs]);

  const getAyahKey = (surahNo, ayah) => `${surahNo}-${ayah.numberInSurah}`;
  const isBookmarked = (surahNo, ayah) => Boolean(bookmarks[getAyahKey(surahNo, ayah)]);
  const toggleBookmark = (surahNo, ayah) => {
    const key = getAyahKey(surahNo, ayah);
    setBookmarks((b) => ({ ...b, [key]: !b[key] }));
  };

  const playAyah = (ayahIdx) => {
    const audioAyah = audioAyahs[ayahIdx];
    if (!audioAyah || !audioAyah.audio) return;
    if (!audioRef.current) audioRef.current = new Audio();
    const el = audioRef.current;
    if (playingAyah === ayahIdx && !el.paused) {
      el.pause();
      setPlayingAyah(null);
    } else {
      el.src = audioAyah.audio;
      el.play().catch(() => {});
      setPlayingAyah(ayahIdx);
      el.onended = () => setPlayingAyah(null);
    }
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
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-700">Translation</label>
                  <select
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="rounded-md border border-emerald-200 px-2 py-1 text-sm"
                  >
                    <option value="none">None</option>
                    <option value="en.asad">English (Asad)</option>
                    <option value="ur.jalandhry">Urdu (Jalandhri)</option>
                  </select>
                </div>
              </div>

              {loading && <div className="mt-6 text-gray-600">Loading surah...</div>}
              {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

              {!loading && !error && (
                <div className="mt-6 space-y-6">
                  {arabicAyahs.map((a, idx) => (
                    <div key={a.number} className="rounded-lg border border-emerald-100 p-4">
                      <div dir="rtl" className="text-2xl leading-loose text-gray-900" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
                        <span className="align-middle">{a.text}</span>
                        <span className="ml-2 text-emerald-700 text-base">﴿{a.numberInSurah}﴾</span>
                      </div>
                      {translation !== 'none' && translationAyahs[idx] && (
                        <div className="mt-2 text-gray-700 text-sm">{translationAyahs[idx].text}</div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => playAyah(idx)}
                          className={`rounded-full px-3 py-1.5 text-sm shadow-sm border ${
                            playingAyah === idx ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {playingAyah === idx ? 'Pause' : 'Play'}
                        </button>
                        <button
                          onClick={() => toggleBookmark(currentSurah.number, a)}
                          className={`rounded-full px-3 py-1.5 text-sm shadow-sm border ${
                            isBookmarked(currentSurah.number, a) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-gray-700 border-emerald-200'
                          }`}
                        >
                          {isBookmarked(currentSurah.number, a) ? 'Bookmarked' : 'Bookmark'}
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
