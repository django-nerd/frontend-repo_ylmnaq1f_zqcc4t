import React from 'react';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { getDaroodBySlug } from './daroodsData';

export default function DaroodDetail({ slug }) {
  const data = getDaroodBySlug(slug);
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => setPlaying(false);
    const onTime = () => setProgress(el.currentTime);
    const onLoaded = () => setDuration(el.duration || 0);
    el.addEventListener('ended', onEnded);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    return () => {
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
    };
  }, []);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const onSeek = (e) => {
    const el = audioRef.current;
    if (!el) return;
    const val = Number(e.target.value);
    el.currentTime = val;
    setProgress(val);
  };

  if (!data) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-gray-700">Darood not found.</p>
        </div>
      </section>
    );
  }

  const goBack = () => {
    window.location.hash = '#/durood-library';
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={goBack} className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800">
          <ArrowLeft className="h-5 w-5" />
          Back to Library
        </button>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{data.title}</h1>
        <p className="text-emerald-700" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{data.urduTitle}</p>

        <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div dir="rtl" className="text-2xl leading-loose" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{data.arabic}</div>

          {data.transliteration && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700">Transliteration</h3>
              <p className="mt-1 text-gray-800">{data.transliteration}</p>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700">English Translation</h3>
            <p className="mt-1 text-gray-800">{data.english}</p>
          </div>

          {data.urdu && (
            <div className="mt-6" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>
              <h3 className="text-sm font-semibold text-gray-700" dir="ltr">Urdu Translation</h3>
              <p className="mt-1 text-gray-800">{data.urdu}</p>
            </div>
          )}

          <div className="mt-6">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {playing ? 'Pause' : 'Play'}
              </button>
              <span className="text-sm text-gray-600">
                {formatTime(progress)} / {formatTime(duration)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(1, duration)}
              value={progress}
              onChange={onSeek}
              className="mt-3 w-full"
            />
            <audio ref={audioRef} src={data.audio} preload="none" />
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
