import React from 'react';
import { Play, Pause, ArrowLeft } from 'lucide-react';
import { getDaroodBySlug } from './daroodsData';
import { useAudio } from './AudioProvider';

export default function DaroodDetail({ slug }) {
  const data = getDaroodBySlug(slug);
  const audio = useAudio();
  const [localProgress, setLocalProgress] = React.useState(0);

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

  const isPlaying = audio.playing && audio.src === new URL(data.audio, window.location.href).href;

  const onToggle = () => {
    if (isPlaying) audio.pause(); else audio.play(data.audio, data.title);
  };

  const onSeek = (e) => {
    const val = Number(e.target.value);
    setLocalProgress(val);
    audio.seek(val);
  };

  React.useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => setLocalProgress(audio.time), 250);
    return () => clearInterval(id);
  }, [isPlaying, audio.time]);

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
              <button onClick={onToggle} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-700">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <span className="text-sm text-gray-600">
                {formatTime(isPlaying ? audio.time : localProgress)} / {formatTime(audio.duration)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(1, audio.duration || 0)}
              value={isPlaying ? audio.time : localProgress}
              onChange={onSeek}
              className="mt-3 w-full"
            />
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
