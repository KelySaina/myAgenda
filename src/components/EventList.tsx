import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Search } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import { LoadingSpinner } from './LoadingSpinner';
import type { Event } from '../types';

export function EventList() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEvent = async (data: any) => {
    await createEvent(data);
  };

  const handleUpdateEvent = async (data: any) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, data);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEvent(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Events</h2>
          <p className="text-gray-600 mt-1">
            {events.length === 0 ? 'No events yet' : `${events.length} event${events.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {events.length > 0 && (
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No matching events' : 'No events yet'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search terms to find what you\'re looking for.'
              : 'Get started by creating your first event. Stay organized and never miss important moments!'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Event</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <EventForm
        event={editingEvent}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        onCancel={handleCloseForm}
        isOpen={showForm}
      />
    </div>
  );
}