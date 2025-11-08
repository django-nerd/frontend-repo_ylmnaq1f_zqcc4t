import React from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function IslamicCalendar() {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth() + 1);
  const [year, setYear] = React.useState(today.getFullYear());
  const [days, setDays] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const fetchCalendar = async (m, y) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_BASE}/api/hijri/calendar?month=${m}&year=${y}`);
      const data = await res.json();
      setDays(data || []);
    } catch (e) {
      setError('Failed to load calendar');
    } finally { setLoading(false); }
  };

  React.useEffect(() => { fetchCalendar(month, year); }, []);

  const next = () => {
    let m = month + 1, y = year;
    if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y); fetchCalendar(m, y);
  };
  const prev = () => {
    let m = month - 1, y = year;
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m); setYear(y); fetchCalendar(m, y);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
          <div className="flex items-center justify-between">
            <button onClick={prev} className="rounded-md border px-3 py-2 text-sm hover:bg-emerald-50">Previous</button>
            <h2 className="text-lg font-semibold text-gray-900">Islamic Calendar – {month}/{year}</h2>
            <button onClick={next} className="rounded-md border px-3 py-2 text-sm hover:bg-emerald-50">Next</button>
          </div>

          {loading && <div className="mt-4 text-gray-600">Loading calendar...</div>}
          {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}

          {!loading && days.length > 0 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {days.map((d, idx) => (
                <div key={idx} className="rounded-lg border border-emerald-100 p-4">
                  <div className="text-sm text-gray-500">{d?.date?.gregorian?.date}</div>
                  <div className="text-xl font-semibold text-gray-900">{d?.date?.hijri?.day} {d?.date?.hijri?.month?.en}</div>
                  <div className="text-xs text-gray-600 mt-1">{d?.date?.hijri?.weekday?.en}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
