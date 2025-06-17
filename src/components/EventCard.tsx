import React from 'react';
import { Calendar, Clock, Edit, Trash2, FileText } from 'lucide-react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = new Date(event.start_time) > new Date();
  const isPast = new Date(event.start_time) < new Date();

  return (
    <div className={`bg-white rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200 ${
      isUpcoming ? 'border-l-blue-500' : isPast ? 'border-l-gray-400' : 'border-l-green-500'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">{event.title}</h3>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={() => onEdit(event)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
              title="Edit event"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              title="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {event.description && (
          <div className="flex items-start space-x-2 mb-4">
            <FileText className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
            <p className="text-gray-600 text-sm">{event.description}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.start_time)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>
              {formatTime(event.start_time)}
              {event.end_time && ` - ${formatTime(event.end_time)}`}
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isUpcoming 
              ? 'bg-blue-100 text-blue-800' 
              : isPast 
              ? 'bg-gray-100 text-gray-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {isUpcoming ? 'Upcoming' : isPast ? 'Past' : 'Happening Now'}
          </span>
        </div>
      </div>
    </div>
  );
}