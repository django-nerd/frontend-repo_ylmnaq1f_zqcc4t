import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewHero from './components/NewHero';
import Quran from './components/Quran';
import { AudioProvider } from './components/AudioProvider';

export default function App() {
  return (
    <AudioProvider>
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Header />
        <main className="flex-1">
          <NewHero />
          <Quran />
        </main>
        <Footer />
      </div>
    </AudioProvider>
  );
}
