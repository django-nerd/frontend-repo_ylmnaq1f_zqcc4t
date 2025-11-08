import React from 'react';
import Header from './components/Header';
import NewHero from './components/NewHero';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';
import Quran from './components/Quran';
import Dua from './components/Dua';
import Hadith from './components/Hadith';
import PrayerTimes from './components/PrayerTimes';
import IslamicCalendar from './components/IslamicCalendar';
import Books from './components/Books';
import Tools from './components/Tools';
import Contact from './components/Contact';
import DaroodLibrary from './components/DaroodLibrary';
import DaroodDetail from './components/DaroodDetail';
import { AudioProvider } from './components/AudioProvider';

const routes = {
  '#/': () => <HomePage />,
  '#/about': () => <SimplePage title="About Us" />,
  '#/durood-library': () => <DaroodLibrary />,
  '#/quran': () => <Quran />,
  '#/dua': () => <Dua />,
  '#/hadith': () => <Hadith />,
  '#/prayer-times': () => <PrayerTimes />,
  '#/islamic-calendar': () => <IslamicCalendar />,
  '#/islamic-books': () => <Books />,
  '#/tools': () => <Tools />,
  '#/contact': () => <Contact />,
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
  if (hash.startsWith('#/darood/')) {
    const slug = decodeURIComponent(hash.replace('#/darood/', '').trim());
    return <DaroodDetail slug={slug} />;
    }
  const Page = routes[hash] || routes['#/'];
  return <Page />;
}

function HomePage() {
  return (
    <main>
      <NewHero />
      <FeaturesGrid />
    </main>
  );
}

function SimplePage({ title }) {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-emerald-100 bg-white p-10 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-white text-gray-900">
        <Header />
        <RouterView />
        <Footer />
      </div>
    </AudioProvider>
  );
}
