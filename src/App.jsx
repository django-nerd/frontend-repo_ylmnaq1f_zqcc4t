import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';

const routes = {
  '#/': () => <HomePage />,
  '#/about': () => <EmptyPage title="About Us" />,
  '#/durood-library': () => <EmptyPage title="Durood Library" />,
  '#/quran': () => <EmptyPage title="Quran" />,
  '#/dua': () => <EmptyPage title="Dua" />,
  '#/hadith': () => <EmptyPage title="Hadith" />,
  '#/prayer-times': () => <EmptyPage title="Prayer Times" />,
  '#/islamic-calendar': () => <EmptyPage title="Islamic Calendar" />,
  '#/islamic-books': () => <EmptyPage title="Islamic Books" />,
  '#/tools': () => <EmptyPage title="Tools" />,
  '#/contact': () => <EmptyPage title="Contact" />,
};

function useHashRoute() {
  const [hash, setHash] = React.useState(window.location.hash || '#/');
  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || '#/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return hash;
}

function RouterView() {
  const hash = useHashRoute();
  const Page = routes[hash] || routes['#/'];
  return <Page />;
}

function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturesGrid />
    </main>
  );
}

function EmptyPage({ title }) {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-emerald-100 bg-white p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">This page is prepared and waiting for future content.</p>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <RouterView />
      <Footer />
    </div>
  );
}
