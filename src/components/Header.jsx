import React from 'react';
import { Home, Info, Library, BookOpen, Star, Scroll, Clock, Calendar, Book, Wrench, Mail } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#/', icon: Home },
  { label: 'About Us', href: '#/about', icon: Info },
  { label: 'Durood Library', href: '#/durood-library', icon: Library },
  { label: 'Quran', href: '#/quran', icon: BookOpen },
  { label: 'Dua', href: '#/dua', icon: Star },
  { label: 'Hadith', href: '#/hadith', icon: Scroll },
  { label: 'Prayer Times', href: '#/prayer-times', icon: Clock },
  { label: 'Islamic Calendar', href: '#/islamic-calendar', icon: Calendar },
  { label: 'Islamic Books', href: '#/islamic-books', icon: Book },
  { label: 'Tools', href: '#/tools', icon: Wrench },
  { label: 'Contact', href: '#/contact', icon: Mail },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-emerald-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white grid place-items-center shadow-sm">DS</div>
            <span className="font-semibold text-gray-900">Durood Shareef</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        className="inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 text-gray-700 shadow-sm hover:bg-emerald-50"
      >
        Menu
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-2 shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
