import React from 'react';
import { Header } from '../components/Header';
import { EventList } from '../components/EventList';

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <EventList />
      </main>
    </div>
  );
}