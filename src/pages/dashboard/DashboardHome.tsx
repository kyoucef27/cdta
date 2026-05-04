import React from 'react';
import { useDashboard } from '../../contexts/DashboardContext';

interface StatCard {
  label: string;
  count: number | string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

export const DashboardHome = () => {
  const { cache, isInitialized } = useDashboard();
  const loading = !isInitialized;

  const counts = {
    pages: cache.Pages?.length ?? 0,
    events: cache.Events?.length ?? 0,
    news: cache.News?.length ?? 0,
    services: cache.Services?.length ?? 0,
  };


  const cards: StatCard[] = [
    {
      label: 'Pages',
      count: loading ? '...' : counts.pages,
      color: '#0a0a0a',
      bg: 'rgba(99,102,241,0.12)',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Events',
      count: loading ? '...' : counts.events,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.12)',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'News',
      count: loading ? '...' : counts.news,
      color: '#10b981',
      bg: 'rgba(16,185,129,0.12)',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    },
    {
      label: 'Services',
      count: loading ? '...' : counts.services,
      color: '#ec4899',
      bg: 'rgba(236,72,153,0.12)',
      icon: (
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ padding: '32px 36px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.5px' }}>
          Overview
        </h1>
        <p style={{ color: '#64748b', fontSize: 14, marginTop: 4, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
          Welcome back! Here's a snapshot of your content.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: card.bg, color: card.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', fontFamily: '"DM Sans", system-ui, sans-serif', lineHeight: 1 }}>
                {card.count}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', margin: '0 0 16px', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: '+ New Page', color: '#0a0a0a', section: 'pages' },
            { label: '+ New Event', color: '#f59e0b', section: 'events' },
            { label: '+ New News', color: '#10b981', section: 'news' },
            { label: '+ New Service', color: '#ec4899', section: 'services' },
          ].map(btn => (
            <button
              key={btn.label}
              style={{
                padding: '9px 18px', borderRadius: 10, border: 'none',
                background: btn.color + '15', color: btn.color,
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = btn.color + '25';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = btn.color + '15';
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

