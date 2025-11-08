import React from 'react';
import { Search } from 'lucide-react';
import { daroods } from './daroodsData';

export default function DaroodLibrary() {
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return daroods;
    return daroods.filter((d) =>
      [d.title, d.urduTitle, d.preview].some((v) => (v || '').toLowerCase().includes(q))
    );
  }, [query]);

  const openDetail = (slug) => {
    window.location.hash = `#/darood/${slug}`;
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Darood Library</h1>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Daroods..."
              className="w-full rounded-full border border-gray-200 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <button
              key={d.slug}
              onClick={() => openDetail(d.slug)}
              className="text-left rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{d.title}</h3>
                  <p className="text-emerald-700 text-sm" dir="rtl" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{d.urduTitle}</p>
                </div>
              </div>
              <p dir="rtl" className="mt-3 text-gray-700 line-clamp-1" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{d.preview}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
