import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatWidget from './ChatWidget';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col font-sans text-slate-900 bg-sand-50/50">
      <Navbar />
      <main className="flex-1 w-full relative">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
