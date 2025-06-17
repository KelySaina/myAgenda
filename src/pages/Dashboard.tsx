import React from 'react';
import { Header } from '../components/Header';
import { Calendar } from '../components/Calendar';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <Calendar />
      </main>
    </div>
  );
}