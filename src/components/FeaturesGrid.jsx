import React from 'react';
import { Info, Library, BookOpen, Star, Scroll, Clock, Calendar, Book, Wrench, Mail, Home } from 'lucide-react';

const features = [
  { title: 'About Us', href: '#/about', icon: Info, desc: 'Learn about our purpose and mission.' },
  { title: 'Durood Library', href: '#/durood-library', icon: Library, desc: 'Explore a growing collection.' },
  { title: 'Quran', href: '#/quran', icon: BookOpen, desc: 'Read and reflect on the Qur’an.' },
  { title: 'Dua', href: '#/dua', icon: Star, desc: 'Supplications for daily life.' },
  { title: 'Hadith', href: '#/hadith', icon: Scroll, desc: 'Sayings and traditions.' },
  { title: 'Prayer Times', href: '#/prayer-times', icon: Clock, desc: 'Find times for your location.' },
  { title: 'Islamic Calendar', href: '#/islamic-calendar', icon: Calendar, desc: 'Track important dates.' },
  { title: 'Islamic Books', href: '#/islamic-books', icon: Book, desc: 'Recommended readings.' },
  { title: 'Tools', href: '#/tools', icon: Wrench, desc: 'Helpful utilities.' },
  { title: 'Contact', href: '#/contact', icon: Mail, desc: 'Get in touch with us.' },
];

export default function FeaturesGrid() {
  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900">Explore</h2>
        <p className="mt-1 text-gray-600">Core sections of the site—each ready for future content.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <a
              key={f.title}
              href={f.href}
              className="group rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow-md transition hover:border-emerald-200"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
