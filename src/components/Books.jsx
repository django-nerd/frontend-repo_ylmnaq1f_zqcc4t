import React from 'react';

const BOOKS = [
  { id: 1, title: 'Fortress of the Muslim', author: 'Said bin Ali Al-Qahtani', desc: 'Collection of authentic supplications.', file: '/books/sample1.pdf', topic: 'Spirituality' },
  { id: 2, title: 'Riyadh as-Salihin', author: 'Imam an-Nawawi', desc: 'Gardens of the Righteous – selected hadith.', file: '/books/sample2.pdf', topic: 'Hadith' },
  { id: 3, title: 'Sealed Nectar (Ar-Raheeq)', author: 'Safiu-rahman Mubarakpuri', desc: 'Biography of Prophet Muhammad.', file: '/books/sample3.pdf', topic: 'Seerah' },
  { id: 4, title: 'Tafsir Ibn Kathir – Selections', author: 'Ibn Kathir', desc: 'Selected exegesis passages.', file: '/books/sample4.pdf', topic: 'Tafsir' },
  { id: 5, title: 'Fiqh Essentials', author: 'Various', desc: 'Concise fiqh topics overview.', file: '/books/sample5.pdf', topic: 'Fiqh' },
];

export default function Books() {
  const [topic, setTopic] = React.useState('All');
  const topics = ['All', ...Array.from(new Set(BOOKS.map(b => b.topic)))];
  const shown = BOOKS.filter(b => topic === 'All' || b.topic === topic);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Category</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className="rounded-md border border-emerald-200 px-2 py-1 text-sm">
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map(b => (
              <div key={b.id} className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900">{b.title}</h3>
                <p className="text-sm text-gray-600">{b.author}</p>
                <p className="text-sm text-gray-700 mt-2">{b.desc}</p>
                <a href={b.file} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-md bg-emerald-600 px-4 py-2 text-white text-sm hover:bg-emerald-700">Read / Download</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
