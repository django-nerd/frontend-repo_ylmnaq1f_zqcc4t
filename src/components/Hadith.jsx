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

export default function Hadith() {
  const [collections, setCollections] = React.useState([
    { name: 'bukhari', slug: 'bukhari' },
    { name: 'muslim', slug: 'muslim' },
    { name: 'tirmidzi', slug: 'tirmidzi' },
    { name: 'abudaud', slug: 'abudaud' },
    { name: 'nasai', slug: 'nasai' },
    { name: 'ibnumajah', slug: 'ibnumajah' },
  ]);
  const [current, setCurrent] = React.useState('bukhari');
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [favorites, setFavorites] = useLocalStorage('hadith_favorites', {});

  React.useEffect(() => {
    const load = async () => {
      setLoading(true); setError('');
      try {
        const res = await fetch(`${API_BASE}/api/hadith/${current}?start=1&end=200`);
        const data = await res.json();
        const list = data?.hadiths || data?.chapters || data?.items || data?.data || [];
        // Normalize
        const normalized = (list || []).map((h, idx) => ({
          id: h.number || h.hadithnumber || idx + 1,
          arab: h.arab || h.arabic || h.textAr || h.textArabic || h.text || '',
          eng: h.id || h.en || h.textEn || h.translation || h?.idText || h?.id || '',
          ref: `${current.toUpperCase()} ${h.number || h.hadithnumber || ''}`,
        }));
        setItems(normalized);
      } catch (e) {
        setError('Failed to load hadith.');
      } finally { setLoading(false); }
    };
    load();
  }, [current]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(h => (h.eng || '').toLowerCase().includes(q) || (h.arab || '').includes(q));
  }, [items, query]);

  const toggleFav = (key) => setFavorites((f) => ({ ...f, [key]: !f[key] }));
  const isFav = (key) => Boolean(favorites[key]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4 h-[70vh] overflow-auto">
          <h2 className="font-semibold text-gray-900">Collections</h2>
          <div className="mt-3 space-y-2">
            {collections.map((c) => (
              <button
                key={c.slug}
                onClick={() => setCurrent(c.slug)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-emerald-50 ${current === c.slug ? 'bg-emerald-100 text-emerald-800' : 'text-gray-700'}`}
              >
                {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
              </button>
            ))}
          </div>
        </aside>
        <div>
          <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-xl font-bold text-gray-900">Hadith – {current.toUpperCase()}</h1>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search English translation"
                className="w-full sm:w-80 rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {loading && <div className="mt-4 text-gray-600">Loading hadith...</div>}
            {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
            {!loading && !error && (
              <div className="mt-4 space-y-5 max-h-[70vh] overflow-auto pr-2">
                {filtered.map((h) => (
                  <div key={h.id} className="rounded-lg border border-emerald-100 p-4">
                    <div dir="rtl" className="text-xl leading-relaxed" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{h.arab}</div>
                    <div className="mt-2 text-gray-800 text-sm">{h.eng}</div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{h.ref}</span>
                      <button
                        onClick={() => toggleFav(`${current}-${h.id}`)}
                        className={`rounded-full px-3 py-1 border text-xs ${isFav(`${current}-${h.id}`) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-white text-gray-700 border-emerald-200'}`}
                      >
                        {isFav(`${current}-${h.id}`) ? 'Favorited' : 'Favorite'}
                      </button>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-sm text-gray-600">No results found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
