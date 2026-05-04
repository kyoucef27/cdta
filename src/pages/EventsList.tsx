import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EventService } from '../services/event.service';
import { usePublic } from '../contexts/PublicContext';

export const EventsList = () => {
  const { cache, setPublicCache } = usePublic();
  const [loading, setLoading] = useState(!cache.events);
  const [error, setError] = useState('');

  const events = useMemo(() => {
    if (!cache.events) return [];
    return [...cache.events]
      .filter((e: any) => e.status === 'published')
      .sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  }, [cache.events]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAll();
        const allEvents = Array.isArray(res) ? res : res.data || [];
        setPublicCache('events', allEvents);
      } catch (err) {
        console.error('Failed to fetch events', err);
        if (!cache.events) setError('Could not load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [setPublicCache, cache.events]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '80vh', background: '#050505', display: 'flex', 
        alignItems: 'center', justifyContent: 'center' 
      }}>
        <div style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
      {/* ── HERO SECTION ── */}
      <section style={{
        padding: '100px 24px 60px',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(99,102,241,0.08) 0%, transparent 70%)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ 
            fontSize: 'clamp(36px, 6vw, 64px)', 
            fontFamily: '"DM Serif Display", serif', 
            fontWeight: 400,
            letterSpacing: '-0.01em',
            margin: '0 0 16px',
            color: '#ffffff'
          }}>
            Academic Events
          </h1>
          <p style={{ 
            fontSize: 'clamp(15px, 3vw, 18px)', 
            color: '#94a3b8', 
            maxWidth: 500, 
            margin: '0 auto',
            lineHeight: 1.5,
            fontFamily: '"Spectral", serif'
          }}>
            Chronological overview of conferences, workshops, and symposiums at CDTA.
          </p>
        </div>
      </section>

      {/* ── GRID SECTION ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {error ? (
          <div style={{ textAlign: 'center', color: '#f87171', padding: 40, background: 'rgba(239,68,68,0.05)', borderRadius: 24 }}>
            {error}
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: 100 }}>
            <p style={{ fontSize: 16, fontFamily: '"Spectral", serif' }}>No upcoming events scheduled.</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 400px))', 
            gap: 32,
            justifyContent: events.length < 3 ? 'center' : 'start'
          }}>
            {events.map((event) => (
              <div 
                key={event.id} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#0a0a0a',
                  borderRadius: 24,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                {/* Media Container */}
                <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: '#111' }}>
                  {event.image ? (
                    <img 
                      src={`http://localhost:8000/storage/${event.image}`} 
                      alt={event.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.15 }}>
                      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    padding: '4px 10px', borderRadius: 8,
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    {event.category || 'Event'}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ 
                    fontSize: 12, color: '#6366f1', fontWeight: 700, 
                    marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' 
                  }}>
                    {formatDate(event.start_date)} {event.end_date ? `— ${formatDate(event.end_date)}` : ''}
                  </div>

                  <h3 style={{ 
                    fontSize: 20, fontWeight: 400, margin: '0 0 12px', 
                    fontFamily: '"DM Serif Display", serif', lineHeight: 1.3,
                    color: '#fff'
                  }}>
                    {event.title}
                  </h3>

                  <p style={{ 
                    fontSize: 14, color: '#94a3b8', lineHeight: 1.5, 
                    margin: '0 0 20px', flex: 1, fontFamily: '"Spectral", serif'
                  }}>
                    {event.description?.replace(/<[^>]+>/g, '').slice(0, 120)}...
                  </p>

                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {event.location}
                    </div>
                    
                    <Link to={`/events/${event.id}`} style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none'
                    }}>
                      View
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

