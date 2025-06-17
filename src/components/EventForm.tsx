import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Save } from 'lucide-react';
import { format } from 'date-fns';
import type { Event, EventFormData } from '../types';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  selectedDate?: Date | null;
}

export function EventForm({ event, onSubmit, onCancel, isOpen, selectedDate }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        start_time: new Date(event.start_time).toISOString().slice(0, 16),
        end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
      });
    } else if (selectedDate) {
      // Pre-fill with selected date
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      setFormData({
        title: '',
        description: '',
        start_time: `${dateStr}T09:00`,
        end_time: `${dateStr}T10:00`,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
      });
    }
    setError(null);
  }, [event, selectedDate, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.start_time) {
      setError('Start time is required');
      return;
    }

    if (formData.end_time && new Date(formData.end_time) <= new Date(formData.start_time)) {
      setError('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
      });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Event Title</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>Description</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
              placeholder="Enter event description (optional)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>Start Time</span>
              </label>
              <input
                type="datetime-local"
                id="start_time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="end_time" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4" />
                <span>End Time</span>
              </label>
              <input
                type="datetime-local"
                id="end_time"
                value={formData.end_time}
                onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}