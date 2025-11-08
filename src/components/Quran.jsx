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

const AR_RECITERS = [
  { id: 'ar.alafasy', label: 'Mishari Alafasy' },
  { id: 'ar.husary', label: 'Mahmoud Al-Husary' },
  { id: 'ar.abdulbasit', label: 'Abdul Basit' },
];

export default function Quran() {
  const audio = useAudio();

  const [surahs, setSurahs] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [currentSurah, setCurrentSurah] = React.useState(null);

  const [arabicAyahs, setArabicAyahs] = React.useState([]);
  const [audioAyahs, setAudioAyahs] = React.useState([]);
  const [translationAyahs, setTranslationAyahs] = React.useState([]);

  const [arReciter, setArReciter] = useLocalStorage('q_ar_reciter', 'ar.alafasy');
  const [urduMode, setUrduMode] = useLocalStorage('q_urdu_mode', 'tts'); // provider | tts | off
  const [playUrdu, setPlayUrdu] = useLocalStorage('q_play_urdu', true);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  // Playback state
  const [queue, setQueue] = React.useState([]); // [{type:'ar'|'ur', ayahIdx:number, src?:string, ttsText?:string}]
  const [qIndex, setQIndex] = React.useState(-1);

  // Build surah list
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

  // Filter
  React.useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) return setFiltered(surahs);
    setFiltered(
      surahs.filter((s) => s.englishName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || String(s.number).includes(q))
    );
  }, [query, surahs]);

  // Load surah data (text + arabic audio + urdu text)
  React.useEffect(() => {
    if (!currentSurah) return;
    const load = async () => {
      setLoading(true); setError('');
      try {
        const [arRes, audRes, urRes] = await Promise.all([
          fetch(`${API}/surah/${currentSurah.number}`),
          fetch(`${API}/surah/${currentSurah.number}/${arReciter}`),
          fetch(`${API}/surah/${currentSurah.number}/ur.jalandhry`),
        ]);
        const ar = await arRes.json();
        const aud = await audRes.json();
        const ur = await urRes.json();
        const arAyahs = ar?.data?.ayahs || [];
        const audAyahs = aud?.data?.ayahs || [];
        const urAyahs = ur?.data?.ayahs || [];
        setArabicAyahs(arAyahs);
        setAudioAyahs(audAyahs);
        setTranslationAyahs(urAyahs);
        // Build initial queue from start
        const q = buildQueue(arAyahs.length, audAyahs, urAyahs, playUrdu ? urduMode : 'off');
        setQueue(q);
        setQIndex(-1);
      } catch (e) {
        setError('Failed to load surah data');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSurah, arReciter]);

  // Rebuild queue when Urdu settings change
  React.useEffect(() => {
    if (!arabicAyahs.length || !audioAyahs.length) return;
    const q = buildQueue(arabicAyahs.length, audioAyahs, translationAyahs, playUrdu ? urduMode : 'off');
    setQueue(q);
    // Keep position aligned to ayah boundary if possible
    if (qIndex >= 0) {
      const current = queue[qIndex];
      if (current) {
        const positionInAyah = current.type; // 'ar' | 'ur'
        const baseIdx = current.ayahIdx;
        const newIdx = q.findIndex((it) => it.ayahIdx === baseIdx && it.type === positionInAyah);
        if (newIdx >= 0) setQIndex(newIdx);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urduMode, playUrdu, translationAyahs]);

  // Attach ended handler to global audio to auto-advance
  React.useEffect(() => {
    const el = audio.audioEl();
    const onEnded = () => {
      playNext();
    };
    el.addEventListener('ended', onEnded);
    return () => el.removeEventListener('ended', onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, qIndex]);

  // Build queue helper
  function buildQueue(count, arabicAudio, urduTextArr, urMode) {
    const q = [];
    for (let i = 0; i < count; i++) {
      const arSrc = arabicAudio?.[i]?.audio || '';
      if (arSrc) q.push({ type: 'ar', ayahIdx: i, src: arSrc });
      if (urMode !== 'off') {
        if (urMode === 'provider') {
          // No widely available provider Urdu per-ayah audio via this API; leave empty so it will be skipped.
          const urSrc = undefined;
          if (urSrc) q.push({ type: 'ur', ayahIdx: i, src: urSrc });
          else q.push({ type: 'ur', ayahIdx: i, ttsText: urduTextArr?.[i]?.text || '' });
        } else if (urMode === 'tts') {
          q.push({ type: 'ur', ayahIdx: i, ttsText: urduTextArr?.[i]?.text || '' });
        }
      }
    }
    return q;
  }

  // Playback engine for current queue item
  const playAt = async (idx) => {
    if (idx < 0 || idx >= queue.length) return;
    const item = queue[idx];
    setQIndex(idx);
    // Scroll to ayah
    const node = document.getElementById(`ayah-${item.ayahIdx}`);
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Preload next couple of audio items
    preloadAround(idx);

    if (item.type === 'ur' && item.ttsText) {
      // Pause HTMLAudio while TTS speaks
      try { audio.pause(); } catch {}
      speakTTS(item.ttsText, 'ur-PK', () => {
        // on end or fail, move next
        if (autoAdvanceRef.current) playNextInternal();
      });
      return;
    }

    // Regular audio via global element
    try {
      await audio.play(item.src, queueLabel(item));
    } catch {
      // skip failed item
      if (autoAdvanceRef.current) playNextInternal();
    }
  };

  const queueLabel = (item) => {
    const sName = currentSurah ? currentSurah.englishName : 'Surah';
    const part = item.type === 'ar' ? 'Arabic' : 'Urdu';
    return `${sName} • Ayah ${item.ayahIdx + 1} • ${part}`;
  };

  // TTS helper
  const ttsRef = React.useRef(null);
  const autoAdvanceRef = React.useRef(true);
  const [autoAdvance, setAutoAdvance] = useLocalStorage('q_auto_advance', true);
  React.useEffect(() => { autoAdvanceRef.current = autoAdvance; }, [autoAdvance]);

  function speakTTS(text, lang, onEnd) {
    try {
      if (!('speechSynthesis' in window)) { onEnd?.(); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang || 'ur-PK';
      u.rate = 0.95;
      u.onend = () => onEnd?.();
      u.onerror = () => onEnd?.();
      ttsRef.current = u;
      window.speechSynthesis.speak(u);
    } catch {
      onEnd?.();
    }
  }

  function stopTTS() {
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch {}
  }

  // Preload next 1-2 audio items
  function preloadAround(idx) {
    for (let offset = 1; offset <= 2; offset++) {
      const n = queue[idx + offset];
      if (n && n.src) {
        const a = new Audio();
        a.preload = 'auto';
        a.src = n.src;
      }
    }
  }

  function playNextInternal() {
    const next = qIndex + 1;
    if (next < queue.length) playAt(next);
  }

  const playNext = () => {
    playNextInternal();
  };

  const playPrev = () => {
    const prev = qIndex > 0 ? qIndex - 1 : 0;
    playAt(prev);
  };

  const startFromAyah = (ayahIdx) => {
    // Find the Arabic item for this ayah
    const idx = queue.findIndex((it) => it.ayahIdx === ayahIdx && it.type === 'ar');
    if (idx >= 0) {
      stopTTS();
      playAt(idx);
    }
  };

  const toggleAyah = (ayahIdx) => {
    const idx = queue.findIndex((it) => it.ayahIdx === ayahIdx && it.type === 'ar');
    if (idx < 0) return;
    const item = queue[idx];
    const sameSrc = item.src && audio.src === new URL(item.src, window.location.href).href;
    if (sameSrc && audio.playing) audio.pause(); else startFromAyah(ayahIdx);
  };

  const isCurrentAyah = (ayahIdx) => {
    const item = queue[qIndex];
    return item && item.ayahIdx === ayahIdx && (audio.playing || (item.type === 'ur' && ttsSpeaking()));
  };

  function ttsSpeaking() {
    try { return 'speechSynthesis' in window ? window.speechSynthesis.speaking : false; } catch { return false; }
  }

  // Global Play/Pause button behavior
  const onGlobalPlayPause = () => {
    if (qIndex >= 0) {
      const current = queue[qIndex];
      if (current.type === 'ur' && current.ttsText) {
        // Toggle TTS by pausing/canceling
        if (ttsSpeaking()) stopTTS(); else speakTTS(current.ttsText, 'ur-PK', () => { if (autoAdvanceRef.current) playNextInternal(); });
      } else {
        audio.toggle(audio.src, '');
      }
    } else {
      // Start from beginning
      startFromAyah(0);
    }
  };

  // Clean up TTS when unmounting or switching
  React.useEffect(() => () => stopTTS(), [currentSurah]);

  const onSeek = (e) => {
    const val = Number(e.target.value || 0);
    audio.seek(val);
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
                onClick={() => { setCurrentSurah(s); stopTTS(); audio.pause(); }}
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
                  <button onClick={playPrev} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700">
                    <SkipBack className="h-4 w-4" /> Prev
                  </button>
                  <button onClick={onGlobalPlayPause} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${audio.playing || ttsSpeaking() ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                    {audio.playing || ttsSpeaking() ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {audio.playing || ttsSpeaking() ? 'Pause' : 'Play'}
                  </button>
                  <button onClick={playNext} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-1.5 text-sm text-emerald-700">
                    Next <SkipForward className="h-4 w-4" />
                  </button>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={autoAdvance} onChange={(e) => setAutoAdvance(e.target.checked)} /> Auto-advance ayahs
                  </label>

                  <select
                    value={arReciter}
                    onChange={async (e) => { setArReciter(e.target.value); stopTTS(); audio.pause(); }}
                    className="rounded-md border border-emerald-200 px-2 py-1 text-sm"
                  >
                    {AR_RECITERS.map(r => <option key={r.id} value={r.id}>Arabic: {r.label}</option>)}
                  </select>

                  <select
                    value={urduMode}
                    onChange={(e) => setUrduMode(e.target.value)}
                    className="rounded-md border border-emerald-200 px-2 py-1 text-sm"
                  >
                    <option value="provider">Urdu: Provider audio (if available)</option>
                    <option value="tts">Urdu: TTS</option>
                    <option value="off">Urdu: Off</option>
                  </select>

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={playUrdu} onChange={(e) => setPlayUrdu(e.target.checked)} /> Play Urdu after each ayah
                  </label>
                </div>
              </div>

              {/* Seek bar (for HTMLAudio only) */}
              <div className="mt-3">
                <input
                  type="range"
                  min={0}
                  max={Math.floor(audio.duration || 0)}
                  value={Math.floor(audio.time || 0)}
                  onChange={onSeek}
                  className="w-full"
                  disabled={ttsSpeaking()}
                />
                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                  <span>{formatTime(audio.time)}</span>
                  <span>{formatTime(audio.duration)}</span>
                </div>
              </div>

              {loading && <div className="mt-6 text-gray-600">Loading surah...</div>}
              {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

              {!loading && !error && (
                <div className="mt-6 space-y-6 max-h-[70vh] overflow-auto pr-2">
                  {arabicAyahs.map((a, idx) => (
                    <div key={a.number} id={`ayah-${idx}`} className={`rounded-lg border p-4 ${isCurrentAyah(idx) ? 'border-emerald-400 bg-emerald-50/50' : 'border-emerald-100'}`}>
                      <div dir="rtl" className="text-2xl leading-loose text-gray-900" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
                        <span className="align-middle">{a.text}</span>
                        <span className="ml-2 text-emerald-700 text-base">﴿{a.numberInSurah}﴾</span>
                      </div>
                      {translationAyahs[idx] && (
                        <div dir="rtl" className="mt-2 text-gray-700 text-sm" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{translationAyahs[idx].text}</div>
                      )}
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => toggleAyah(idx)}
                          className={`rounded-full px-3 py-1.5 text-sm shadow-sm border ${
                            isCurrentAyah(idx) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isCurrentAyah(idx) ? 'Pause' : 'Play'}
                        </button>
                        <button
                          onClick={() => startFromAyah(idx)}
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

function formatTime(sec) {
  const s = Math.floor(sec || 0);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
