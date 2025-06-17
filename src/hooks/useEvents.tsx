import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './useAuth';
import { sendEventConfirmation } from '../services/emailService';
import type { Event, EventFormData } from '../types';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch events
  const fetchEvents = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  // Create event
  const createEvent = async (eventData: EventFormData) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            ...eventData,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => [...prev, data].sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));

      // Send confirmation email - ensure we have a valid email
      if (user.email && user.email.trim() !== '') {
        console.log(user)
        await sendEventConfirmation(
          user.email,
          eventData.title,
          new Date(eventData.start_time).toLocaleString()
        );
      } else {
        console.warn('User email not available - skipping email notification');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update event
  const updateEvent = async (id: string, eventData: Partial<EventFormData>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setEvents(prev => prev.map(event => 
        event.id === id ? data : event
      ).sort(
        (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete event
  const deleteEvent = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchEvents();

    const channel = supabase
      .channel('events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEvents(prev => [...prev, payload.new as Event].sort(
              (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            ));
          } else if (payload.eventType === 'UPDATE') {
            setEvents(prev => prev.map(event =>
              event.id === payload.new.id ? payload.new as Event : event
            ));
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}