import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-emerald-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Durood Shareef. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#/about" className="hover:text-emerald-700">About</a>
            <a href="#/contact" className="hover:text-emerald-700">Contact</a>
            <a href="#/tools" className="hover:text-emerald-700">Tools</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
