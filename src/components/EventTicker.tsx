import React, { useEffect, useState } from 'react';
import { EventService } from '../services/event.service';
import { Link } from 'react-router-dom';

export const EventTicker = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAll();
        const allEvents = Array.isArray(res) ? res : res.data || [];
        // Only show upcoming published events
        const upcoming = allEvents
          .filter((e: any) => e.status === 'published')
          .slice(0, 5);
        setEvents(upcoming);
      } catch (e) {
        console.error('Ticker fetch failed', e);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [events]);

  if (events.length === 0) return null;

  const currentEvent = events[currentIndex];

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'relative',
      zIndex: 1001,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        maxWidth: 1200,
        width: '100%',
        padding: '0 24px',
        animation: 'tickerFade 0.5s ease-out'
      }}>
        {/* Pulse Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#a855f7',
            boxShadow: '0 0 10px #a855f7',
            animation: 'pulse 2s infinite'
          }} />
          <span style={{ 
            color: '#a855f7', fontSize: 11, fontWeight: 800, 
            letterSpacing: '0.1em', textTransform: 'uppercase' 
          }}>
            Upcoming Event
          </span>
        </div>

        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.2)' }} />

        {/* Content */}
        <Link 
          to={`/events/${currentEvent.id}`}
          style={{ 
            color: '#fff', fontSize: 13, textDecoration: 'none', 
            fontWeight: 500, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', 
            textOverflow: 'ellipsis', fontFamily: '"DM Sans", sans-serif'
          }}
        >
          <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: 8 }}>
            {new Date(currentEvent.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}:
          </span>
          {currentEvent.title}
        </Link>

        {/* Action */}
        <Link to="/events" style={{
          fontSize: 11, color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          View All →
        </Link>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tickerFade {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
