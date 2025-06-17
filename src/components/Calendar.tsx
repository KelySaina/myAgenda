import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns';
import { useEvents } from '../hooks/useEvents';
import { EventForm } from './EventForm';
import { CalendarEvent } from './CalendarEvent';
import { LoadingSpinner } from './LoadingSpinner';
import type { Event } from '../types';

export function Calendar() {
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.start_time), date)
    );
  };

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
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              title="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
            >
              Today
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center">
              <span className="text-sm font-semibold text-gray-700">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
                } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isDayToday 
                      ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <CalendarEvent
                      key={event.id}
                      event={event}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12 mt-8">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by creating your first event. Click on any date or use the "New Event" button.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Event</span>
          </button>
        </div>
      )}

      <EventForm
        event={editingEvent}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        onCancel={handleCloseForm}
        isOpen={showForm}
        selectedDate={selectedDate}
      />
    </div>
  );
}