import ICAL from 'ical.js';
import { endOfWeek } from 'date-fns';

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
  isAllDay: boolean;
}

export const fetchAndParseCalendar = async (url: string): Promise<CalendarEvent[]> => {
  const fetchWithProxy = async (proxyUrl: string) => {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        throw new Error(`Status: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  }

  let icsData = '';
  let lastError;

  // Try different proxies and direct fetch
  const attempts = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    url
  ];

  for (const attemptUrl of attempts) {
    try {
        icsData = await fetchWithProxy(attemptUrl);
        // If we got here, we have data
        if (icsData.includes('BEGIN:VCALENDAR')) {
            break;
        } else {
             throw new Error('Response does not look like an ICS file');
        }
    } catch (e) {
        console.warn(`Failed to fetch from ${attemptUrl}`, e);
        lastError = e;
    }
  }

  if (!icsData) {
      console.error('All fetch attempts failed.');
      throw lastError || new Error('Failed to fetch calendar from all sources.');
  }

  return parseICS(icsData);
};

const parseICS = (icsData: string): CalendarEvent[] => {
  try {
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents('vevent');
    
    const now = new Date();
    // Limit to the end of the current week (Sunday)
    const futureLimit = endOfWeek(now, { weekStartsOn: 1 });

    const events: CalendarEvent[] = [];

    vevents.forEach((vevent) => {
      const event = new ICAL.Event(vevent);
      
      if (event.isRecurring()) {
        const iterator = event.iterator();
        
        let next = iterator.next();
        
        while (next) {
          const jsDate = next.toJSDate();
          
          if (jsDate > futureLimit) {
            break;
          }
          
          if (jsDate >= now || (event.endDate && event.endDate.toJSDate() > now)) {
             const duration = event.duration;
             const endDate = next.clone();
             endDate.addDuration(duration);

             if (!event.startDate.isDate) {
               events.push({
                  title: event.summary,
                  startDate: jsDate,
                  endDate: endDate.toJSDate(),
                  location: event.location,
                  description: event.description,
                  isAllDay: false,
               });
             }
          }
           next = iterator.next();
        }
      } else {
        // Single event
        const startDate = event.startDate.toJSDate();
        const endDate = event.endDate ? event.endDate.toJSDate() : startDate;

        // Include if it ends in the future (so efficiently "current" events show up)
        // And is NOT an all-day event
        // AND starts before our future limit
        if (endDate > now && startDate <= futureLimit && !event.startDate.isDate) {
          events.push({
            title: event.summary,
            startDate: startDate,
            endDate: endDate,
            location: event.location,
            description: event.description,
            isAllDay: false,
          });
        }
      }
    });

    // Sort by start date
    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  } catch (error) {
    console.error('Error parsing ICS:', error);
    return [];
  }
};
