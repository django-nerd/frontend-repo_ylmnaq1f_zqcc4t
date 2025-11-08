import React from 'react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function Contact() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setStatus('');
    try {
      const res = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) });
      if (!res.ok) throw new Error('Failed');
      await res.json();
      setStatus('Thank you for contacting us');
      setName(''); setEmail(''); setMessage('');
    } catch {
      setStatus('Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
          <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
          <form onSubmit={onSubmit} className="mt-4 grid gap-3 max-w-xl">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-md border border-emerald-200 px-3 py-2 text-sm" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-md border border-emerald-200 px-3 py-2 text-sm" required />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="rounded-md border border-emerald-200 px-3 py-2 text-sm h-32" required />
            <button type="submit" disabled={loading} className="rounded-md bg-emerald-600 text-white px-4 py-2 text-sm hover:bg-emerald-700 disabled:opacity-60">{loading ? 'Sending...' : 'Send'}</button>
          </form>
          {status && <div className="mt-3 text-sm text-emerald-700">{status}</div>}

          <div className="mt-8 grid gap-2 text-sm text-gray-700">
            <div>Address: —</div>
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">Facebook</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">YouTube</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-emerald-700">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
