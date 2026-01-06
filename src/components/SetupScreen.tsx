import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

interface SetupScreenProps {
  onUrlSave: (url: string) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onUrlSave }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSave(url.trim());
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="icon-wrapper">
          <Calendar size={48} />
        </div>
        <h1>Calendar Kiosk Setup</h1>
        <p>Enter your Calendar URL to get started.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            placeholder="https://example.com/calendar.ics"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="url-input"
          />
          <button type="submit" className="save-button">
            Start Kiosk
          </button>
        </form>
      </div>
    </div>
  );
};
