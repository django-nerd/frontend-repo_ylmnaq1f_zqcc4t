import React from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

function Tasbeeh() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Tasbeeh Counter</h3>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={() => setCount((c) => c + 1)} className="rounded-full bg-emerald-600 text-white px-4 py-2">+1</button>
        <button onClick={() => setCount(0)} className="rounded-full border px-4 py-2">Reset</button>
        <div className="ml-auto text-2xl font-bold text-gray-900">{count}</div>
      </div>
    </div>
  );
}

function ZakatCalculator() {
  const [wealth, setWealth] = React.useState('');
  const [type, setType] = React.useState('gold');
  const value = Number(wealth || 0);
  const zakat = value * 0.025;
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Zakat Calculator</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-600">Wealth</label>
          <input value={wealth} onChange={(e) => setWealth(e.target.value)} className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm" placeholder="Amount" />
        </div>
        <div>
          <label className="text-xs text-gray-600">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-md border border-emerald-200 px-3 py-2 text-sm">
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="w-full rounded-md bg-emerald-50 border border-emerald-100 px-4 py-2 text-emerald-800">Zakat: {zakat.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

function QiblaFinder() {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Qibla Finder</h3>
      <p className="mt-2 text-sm text-gray-700">Compass access is limited in browsers. Use your device compass and align with 21.4225°N, 39.8262°E (Makkah). This section can be enhanced with sensor APIs on supported devices.</p>
    </div>
  );
}

function HijriConverter() {
  const [date, setDate] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const convert = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const d = new Date(date);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const res = await fetch(`${API_BASE}/api/hijri/convert?date=${dd}-${mm}-${yyyy}`);
      const data = await res.json();
      setResult(data);
    } finally { setLoading(false); }
  };

  return (
    <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-gray-900">Hijri – Gregorian Converter</h3>
      <div className="mt-3 flex items-center gap-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-md border border-emerald-200 px-3 py-2 text-sm" />
        <button onClick={convert} className="rounded-md bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700">Convert</button>
      </div>
      {loading && <div className="mt-3 text-gray-600 text-sm">Converting...</div>}
      {result && (
        <div className="mt-3 text-sm text-gray-800">Hijri: {result?.hijri?.date || `${result?.day} ${result?.month?.en} ${result?.year}`}</div>
      )}
    </div>
  );
}

export default function Tools() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Tasbeeh />
          <ZakatCalculator />
          <QiblaFinder />
          <HijriConverter />
        </div>
      </div>
    </section>
  );
}
