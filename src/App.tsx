import { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const [calendarUrl, setCalendarUrl] = useState<string | null>(
    localStorage.getItem('calendar_kiosk_url')
  );

  const handleUrlSave = (url: string) => {
    localStorage.setItem('calendar_kiosk_url', url);
    setCalendarUrl(url);
  };

  const handleReset = () => {
    localStorage.removeItem('calendar_kiosk_url');
    setCalendarUrl(null);
  };

  return (
    <div className="app-container">
      {!calendarUrl ? (
        <SetupScreen onUrlSave={handleUrlSave} />
      ) : (
        <Dashboard calendarUrl={calendarUrl} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
