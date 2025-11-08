import React from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

const METHODS = [
  { id: 2, name: 'University of Islamic Sciences, Karachi' },
  { id: 3, name: 'Umm Al-Qura University, Makkah' },
  { id: 4, name: 'Egyptian General Authority of Survey' },
  { id: 5, name: 'Institute of Geophysics, University of Tehran' },
  { id: 7, name: 'Gulf Region' },
  { id: 8, name: 'Kuwait' },
  { id: 9, name: 'Qatar' },
  { id: 10, name: 'Singapore' },
  { id: 12, name: 'Union Organization Islamic de France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
];

export default function PrayerTimes() {
  const [city, setCity] = React.useState('Karachi');
  const [country, setCountry] = React.useState('Pakistan');
  const [method, setMethod] = React.useState(2);
  const [timings, setTimings] = React.useState(null);
  const [hijri, setHijri] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          // If allowed but we don't reverse geocode, keep defaults and just fetch
          fetchTimings(city, country, method);
        },
        () => {
          // denied -> use default Karachi
          fetchTimings('Karachi', 'Pakistan', method);
        }
      );
    } else {
      fetchTimings(city, country, method);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchHijri = async (date) => {
    try {
      const [d, m, y] = date.toLocaleDateString('en-GB').split('/');
      const res = await fetch(`${API_BASE}/api/hijri/convert?date=${d}-${m}-${y}`);
      const data = await res.json();
      setHijri(data?.hijri || data);
    } catch {}
  };

  const fetchTimings = async (c, co, me) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/prayer/timingsByCity?city=${encodeURIComponent(c)}&country=${encodeURIComponent(co)}&method=${me}`);
      const data = await res.json();
      setTimings(data.timings || data);
      fetchHijri(new Date());
    } catch (e) {
      setError('Failed to load prayer times.');
    } finally { setLoading(false); }
  };

  const onApply = () => fetchTimings(city, country, method);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              <div>
                <label className="text-xs text-gray-600">City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-600">Method</label>
                <select value={method} onChange={(e) => setMethod(Number(e.target.value))} className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm">
                  {METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={onApply} className="w-full rounded-md bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700">Apply</button>
              </div>
            </div>
          </div>

          {loading && <div className="mt-4 text-gray-600">Loading timings...</div>}
          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
          {!loading && timings && (
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'].map((k) => (
                <div key={k} className="rounded-lg border border-emerald-100 p-4">
                  <div className="text-sm text-gray-500">{k}</div>
                  <div className="text-xl font-semibold text-gray-900">{timings[k]}</div>
                </div>
              ))}
            </div>
          )}

          {hijri && (
            <div className="mt-6 text-sm text-gray-700">Hijri Date: {hijri?.date?.readable || `${hijri?.day} ${hijri?.month?.en} ${hijri?.year}`}</div>
          )}
        </div>
      </div>
    </section>
  );
}
