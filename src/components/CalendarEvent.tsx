import React, { useState } from 'react';
import { Clock, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Event } from '../types';

interface CalendarEventProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export function CalendarEvent({ event, onEdit, onDelete }: CalendarEventProps) {
  const [showActions, setShowActions] = useState(false);

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  const getEventColor = () => {
    const now = new Date();
    const eventStart = parseISO(event.start_time);
    const eventEnd = event.end_time ? parseISO(event.end_time) : null;
    
    if (eventEnd && now > eventEnd) {
      return 'bg-gray-100 text-gray-600 border-gray-200';
    } else if (now >= eventStart && (!eventEnd || now <= eventEnd)) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
    setShowActions(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(event.id);
    setShowActions(false);
  };

  return (
    <div className="relative">
      <div
        className={`text-xs p-2 rounded border cursor-pointer hover:shadow-sm transition-all duration-200 ${getEventColor()}`}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate" title={event.title}>
              {event.title}
            </div>
            <div className="flex items-center space-x-1 mt-1 opacity-75">
              <Clock className="w-3 h-3" />
              <span>
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </span>
            </div>
          </div>
          <MoreHorizontal className="w-3 h-3 opacity-50" />
        </div>
      </div>

      {/* Action Menu */}
      {showActions && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowActions(false)}
          />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]">
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Edit className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}