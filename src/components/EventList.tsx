import React from 'react';
import type { CalendarEvent } from '../utils/calendar';
import { format, isWithinInterval } from 'date-fns';
import { MapPin, User } from 'lucide-react';

interface EventListProps {
  events: CalendarEvent[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => {
  if (events.length === 0) {
    return (
      <div className="no-events">
        <p>No upcoming events found.</p>
      </div>
    );
  }

  const now = new Date();
  
  return (
    <div className="event-list">
      {events.map((event, index) => {
        const isNow = isWithinInterval(now, { start: event.startDate, end: event.endDate });
        const dayString = format(event.startDate, 'EEEE, MMMM do');
        
        const previousEvent = index > 0 ? events[index - 1] : null;
        const previousDayString = previousEvent ? format(previousEvent.startDate, 'EEEE, MMMM do') : '';
        const showHeader = index === 0 || dayString !== previousDayString;

        const assigneeMatch = event.title.match(/@\w+/g);
        const assignees = assigneeMatch ? assigneeMatch.map(s => s.substring(1)) : [];
        
        const cleanTitle = event.title.replace(/@\w+/g, '').trim();
        const isNextUp = index === 0;

        return (
          <React.Fragment key={index}>
            {showHeader && <h2 className="date-header">{dayString}</h2>}
            
            <div className={`event-card ${isNow ? 'active-event' : ''} ${isNextUp ? 'next-up-event' : ''}`}>
              <div className="event-time">
                {event.isAllDay ? (
                  <span className="all-day-badge">All Day</span>
                ) : (
                  <>
                    <span className="start-time">{format(event.startDate, 'HH:mm')}</span>
                    <span className="end-time">{format(event.endDate, 'HH:mm')}</span>
                  </>
                )}
              </div>
              
              <div className="event-details">
                <div className="event-main-content">
                    <h3 className="event-title">{cleanTitle || event.title}</h3>
                    <div className="event-meta">
                      {event.location && (
                        <div className="event-location">
                          <MapPin size={16} />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                </div>
                
                {assignees.length > 0 && (
                   <div className="event-assignees-right">
                      <div className="assignee-label">
                         <User size={14} /> Assigned
                      </div>
                      <div className="assignee-list">
                         {assignees.map(a => <span key={a} className="assignee-tag">{a}</span>)}
                      </div>
                   </div>
                )}
                
                {isNow && <div className="now-badge">Happening Now</div>}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
