import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventService } from '../services/event.service';

export const EventArticle = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await EventService.getById(id!);
        const data = res.data ?? res;
        
        if (data && data.status === 'published') {
          setEvent(data);
        } else {
          setError('Event not found or is not published.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load the event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh', background: '#0a0a0a' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"
          style={{ animation: 'spin 0.75s linear infinite', margin: '0 auto' }}>
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ maxWidth: 600, margin: '120px auto', textAlign: 'center', padding: 20 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>Oops!</h1>
        <p style={{ fontSize: 18, color: '#a3a3a3', marginBottom: 32 }}>{error}</p>
        <Link to="/events" style={{
          display: 'inline-flex', padding: '14px 28px', background: '#a855f7', color: '#fff',
          textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'all 0.2s'
        }}>
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .event-content { font-family: "DM Sans", system-ui, sans-serif; color: #cbd5e1; line-height: 1.85; font-size: 18px; }
        .event-content h2, .event-content h3 { color: #ffffff; margin-top: 2.5em; margin-bottom: 1em; font-weight: 800; letter-spacing: -0.01em; }
        .event-content p { margin-bottom: 1.8em; }
        .event-content a { color: #a855f7; text-decoration: underline; font-weight: 500; }
        .event-content ul, .event-content ol { margin-bottom: 1.8em; padding-left: 1.5em; }
        .event-content li { margin-bottom: 0.5em; }
        .event-content blockquote { border-left: 4px solid #a855f7; padding-left: 20px; color: #94a3b8; font-style: italic; font-size: 1.1em; background: rgba(168, 85, 247, 0.05); padding: 24px; border-radius: 0 12px 12px 0; margin: 2em 0; }
        .event-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 2.5em 0; border: 1px solid rgba(255,255,255,0.1); }
      `}</style>

      {/* Hero Header */}
      <div style={{ position: 'relative', width: '100%', height: '70vh', background: '#0a0a0a', overflow: 'hidden' }}>
        {event.image ? (
          <img 
            src={`http://localhost:8000/storage/${event.image}`} 
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(45deg, #0f172a, #1e1b4b)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }} />
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '80px 24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.8s ease-out' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <span style={{ background: '#a855f7', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {event.category || 'Event'}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                {event.location || 'CDTA Campus'}
              </span>
            </div>
            
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 400, fontFamily: '"DM Serif Display", serif', lineHeight: 1.1, marginBottom: 32, letterSpacing: '-0.02em' }}>
              {event.title}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, color: '#94a3b8', fontSize: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span>Starts: {formatDate(event.start_date)}</span>
              </div>
              {event.end_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>Ends: {formatDate(event.end_date)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '80px 24px', animation: 'fadeIn 1s ease' }}>
        <div 
          className="event-content"
          dangerouslySetInnerHTML={{ __html: event.description }} 
        />
        
        <div style={{ marginTop: 80, padding: 40, borderRadius: 24, background: '#0f172a', border: '1px solid rgba(168, 85, 247, 0.2)', textAlign: 'center' }}>
          <h3 style={{ fontSize: 24, fontFamily: '"DM Serif Display", serif', marginBottom: 16 }}>Interested in this event?</h3>
          <p style={{ color: '#94a3b8', marginBottom: 32 }}>Contact our communication department for more details or registration inquiries.</p>
          <Link to="/contact" style={{ display: 'inline-flex', padding: '14px 32px', background: '#fff', color: '#0f172a', textDecoration: 'none', borderRadius: 12, fontWeight: 700, transition: 'all 0.2s' }}>
            Inquire Now
          </Link>
        </div>
      </div>
    </div>
  );
};
