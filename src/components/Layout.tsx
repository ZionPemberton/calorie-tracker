import React from 'react';
import NavBar from './NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-zinc-900">
      <NavBar />
      <main className="max-w-4xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
