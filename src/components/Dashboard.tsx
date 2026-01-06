import React, { useEffect, useState, useCallback } from 'react';
import { fetchAndParseCalendar, type CalendarEvent } from '../utils/calendar';
import { EventList } from './EventList';
import { RefreshCw, Settings } from 'lucide-react';

interface DashboardProps {
  calendarUrl: string;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ calendarUrl, onReset }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAndParseCalendar(calendarUrl);
      setEvents(data);
      setLastUpdated(new Date());
    } catch {
      setError('Failed to load calendar data. Check if the URL is correct or Try again later.');
    } finally {
      setLoading(false);
    }
  }, [calendarUrl]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15 * 60 * 1000); // 15 min refresh
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="app-title">TOPAD</h1>
        <div className="header-actions">
           <span className="last-updated">Updated: {lastUpdated.toLocaleTimeString()}</span>
           <button onClick={loadData} className="icon-button" title="Refresh">
             <RefreshCw size={20} />
           </button>
           <button onClick={onReset} className="icon-button" title="Change Calendar">
             <Settings size={20} />
           </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {loading && events.length === 0 ? (
          <div className="loading">Loading events...</div>
        ) : error ? (
           <div className="error-message">
             <p>{error}</p>
             <button onClick={loadData}>Retry</button>
           </div>
        ) : (
          <EventList events={events} />
        )}
      </div>
    </div>
  );
};
