import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [src, setSrc] = useState('');
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [label, setLabel] = useState('');

  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = 'none';
  }

  useEffect(() => {
    const el = audioRef.current;
    const onEnded = () => setPlaying(false);
    const onTime = () => setTime(el.currentTime || 0);
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

  const api = useMemo(() => ({
    audioEl: () => audioRef.current,
    src,
    playing,
    time,
    duration,
    label,
    play: async (nextSrc, displayLabel) => {
      const el = audioRef.current;
      try {
        if (el.src !== nextSrc) {
          el.pause();
          setPlaying(false);
          setTime(0);
          setDuration(0);
          setSrc(nextSrc);
          if (displayLabel) setLabel(displayLabel); else setLabel('');
          el.src = nextSrc;
        }
        await el.play();
        setPlaying(true);
      } catch (e) {
        // ignore
      }
    },
    pause: () => {
      const el = audioRef.current;
      el.pause();
      setPlaying(false);
    },
    toggle: async (nextSrc, displayLabel) => {
      const el = audioRef.current;
      if (nextSrc && el.src !== nextSrc) {
        return api.play(nextSrc, displayLabel);
      }
      if (el.paused) return api.play(el.src, label);
      api.pause();
    },
    seek: (sec) => {
      const el = audioRef.current;
      el.currentTime = Math.max(0, Math.min(sec, el.duration || sec));
      setTime(el.currentTime);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [src, playing, time, duration, label]);

  return (
    <AudioCtx.Provider value={api}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
