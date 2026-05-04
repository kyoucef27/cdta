import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardHome } from './dashboard/DashboardHome';
import { PagesManager } from './dashboard/PagesManager';
import { EventsManager } from './dashboard/EventsManager';
import { NewsManager } from './dashboard/NewsManager';
import { ServicesManager } from './dashboard/ServicesManager';
import { NavManager } from './dashboard/NavManager';
import { MessagesManager } from './dashboard/MessagesManager';
import { PageService } from '../services/page.service';
import { EventService } from '../services/event.service';
import { NewsService } from '../services/news.service';
import { ServiceService } from '../services/service.service';
import { NavService } from '../services/nav.service';
import { useDashboard } from '../contexts/DashboardContext';
import { useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Section = 'overview' | 'pages' | 'events' | 'news' | 'services' | 'navigation' | 'messages';

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// ─── Nav items ────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    color: '#94a3b8',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'pages',
    label: 'Pages',
    color: '#818cf8',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'events',
    label: 'Events',
    color: '#fbbf24',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'news',
    label: 'News',
    color: '#34d399',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    color: '#f472b6',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9}
          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'navigation',
    label: 'Navigation',
    color: '#6366f1',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'messages',
    label: 'Messages',
    color: '#a855f7',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.9} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

// ─── Sidebar nav button ───────────────────────────────────────────────────────
function SideNavBtn({
  item,
  active,
  onClick,
  onMouseEnter,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onMouseEnter?.(); }}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '10px 16px',
        borderRadius: 10,
        border: 'none',
        background: active
          ? 'rgba(255,255,255,0.12)'
          : hovered
          ? 'rgba(255,255,255,0.06)'
          : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        fontFamily: '"DM Sans", system-ui, sans-serif',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.18s ease',
        letterSpacing: '-0.01em',
        position: 'relative',
      }}
    >
      {/* Active indicator */}
      {active && (
        <span style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 3,
          height: 20,
          borderRadius: '0 4px 4px 0',
          background: item.color,
        }} />
      )}

      {/* Icon */}
      <span style={{
        color: active ? item.color : 'rgba(255,255,255,0.45)',
        display: 'flex', alignItems: 'center', flexShrink: 0,
        transition: 'color 0.18s ease',
      }}>
        {item.icon}
      </span>

      {item.label}
    </button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [active, setActive] = useState<Section>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { setCache, isInitialized, setInitialized, clearCache } = useDashboard();

  useEffect(() => {
    if (!isInitialized) {
      const preloadAll = async () => {
        try {
          const [pages, events, news, services, nav] = await Promise.all([
            PageService.getAll(),
            EventService.getAll(),
            NewsService.getAll(),
            ServiceService.getAll(),
            NavService.getAll()
          ]);
          
          setCache('Pages', Array.isArray(pages) ? pages : pages.data);
          setCache('Events', Array.isArray(events) ? events : events.data);
          setCache('News', Array.isArray(news) ? news : news.data);
          setCache('Services', Array.isArray(services) ? services : services.data);
          setCache('Navigation', Array.isArray(nav) ? nav : nav.data);
          
          setInitialized(true);
        } catch (e) {
          console.warn('Full dashboard preload failed', e);
        }
      };
      preloadAll();
    }
  }, [isInitialized, setCache, setInitialized]);

  const handleLogout = () => {
    clearCache();
    logout();
  };

  const prefetchSection = async (section: Section) => {
    try {
      let data: any[] = [];
      if (section === 'pages') {
        const res = await PageService.getAll();
        data = Array.isArray(res) ? res : res.data;
      } else if (section === 'events') {
        const res = await EventService.getAll();
        data = Array.isArray(res) ? res : res.data;
      } else if (section === 'news') {
        const res = await NewsService.getAll();
        data = Array.isArray(res) ? res : res.data;
      } else if (section === 'services') {
        const res = await ServiceService.getAll();
        data = Array.isArray(res) ? res : res.data;
      } else if (section === 'navigation') {
        const res = await NavService.getAll();
        data = Array.isArray(res) ? res : res.data;
      }
      
      if (data.length > 0) {
        // Map section ID to the title used in ContentManager cache
        const cacheKey = section === 'navigation' ? 'Navigation' : section.charAt(0).toUpperCase() + section.slice(1);
        setCache(cacheKey, data);
      }
    } catch (e) {
      console.warn('Prefetch failed', e);
    }
  };

  const renderSection = () => {
    switch (active) {
      case 'overview': return <DashboardHome />;
      case 'pages':    return <PagesManager />;
      case 'events':   return <EventsManager />;
      case 'news':     return <NewsManager />;
      case 'services': return <ServicesManager />;
      case 'navigation': return <NavManager />;
      case 'messages': return <MessagesManager />;
    }
  };

  const currentNav = navItems.find(n => n.id === active)!;

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .dash-root {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: "DM Sans", system-ui, sans-serif;
        }

        /* Sidebar */
        .dash-sidebar {
          width: 240px;
          flex-shrink: 0;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 50;
          overflow-y: auto;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
        }

        /* Main content */
        .dash-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* Topbar */
        .dash-topbar {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 32px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 40;
          flex-shrink: 0;
        }

        /* Mobile overlay */
        .dash-mobile-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .dash-sidebar {
            transform: translateX(-100%);
          }
          .dash-sidebar.open {
            transform: translateX(0);
          }
          .dash-main {
            margin-left: 0;
          }
          .dash-mobile-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 49;
          }
          .dash-hamburger {
            display: flex !important;
          }
        }
      `}</style>

      <div className="dash-root">

        {/* Mobile overlay */}
        {mobileNavOpen && (
          <div className="dash-mobile-overlay" onClick={() => setMobileNavOpen(false)} />
        )}

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside className={`dash-sidebar${mobileNavOpen ? ' open' : ''}`}>

          {/* Brand */}
          <div style={{
            padding: '24px 20px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
          }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/logo.png" alt="CDTA" style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </a>
            <div style={{
              marginTop: 12, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
            }}>
              Content Management
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: '16px 12px', flex: 1 }}>
            <div style={{
              fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
              padding: '0 4px', marginBottom: 8,
            }}>
              Content
            </div>
            {navItems.map(item => (
              <SideNavBtn
                key={item.id}
                item={item}
                active={active === item.id}
                onClick={() => { setActive(item.id); setMobileNavOpen(false); }}
                onMouseEnter={() => prefetchSection(item.id)}
              />
            ))}
          </nav>

          {/* User footer */}
          <div style={{
            padding: '16px 16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #0a0a0a, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {(user?.name ?? user?.email ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', fontFamily: '"DM Sans", system-ui, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name ?? 'Admin'}
                </div>
                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email ?? 'admin'}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '9px', borderRadius: 10,
                border: '1.5px solid rgba(255,255,255,0.1)',
                background: 'transparent', color: 'rgba(255,255,255,0.5)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)';
                (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </aside>

        {/* ── MAIN AREA ────────────────────────────────────────────────────── */}
        <div className="dash-main">

          {/* Top bar */}
          <header className="dash-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Mobile hamburger */}
              <button
                className="dash-hamburger"
                onClick={() => setMobileNavOpen(true)}
                style={{
                  display: 'none', width: 36, height: 36, borderRadius: 8,
                  border: '1.5px solid #e2e8f0', background: 'transparent',
                  cursor: 'pointer', alignItems: 'center', justifyContent: 'center',
                  color: '#374151', flexDirection: 'column', gap: 4, padding: 8,
                }}
              >
                {[1,2,3].map(i => (
                  <span key={i} style={{ width: '100%', height: 1.5, background: '#374151', borderRadius: 2 }} />
                ))}
              </button>

              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                  Dashboard
                </span>
                {active !== 'overview' && (
                  <>
                    <svg width="14" height="14" fill="none" stroke="#cbd5e1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span style={{
                      fontSize: 13, fontWeight: 600, color: currentNav.color,
                      fontFamily: '"DM Sans", system-ui, sans-serif',
                    }}>
                      {currentNav.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Right side: view site link */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 14px', borderRadius: 8,
                border: '1.5px solid #e2e8f0', background: '#fff',
                color: '#374151', fontSize: 13, fontWeight: 500,
                fontFamily: '"DM Sans", system-ui, sans-serif',
                textDecoration: 'none', transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#94a3b8';
                (e.currentTarget as HTMLAnchorElement).style.background = '#f8fafc';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLAnchorElement).style.background = '#fff';
              }}
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Site
            </a>
          </header>

          {/* Section content */}
          <main style={{ flex: 1, minWidth: 0, animation: 'fadeInSection 0.3s ease' }} key={active}>
            {renderSection()}
          </main>
          
          <style>{`
            @keyframes fadeInSection {
              from { opacity: 0; transform: scale(0.99) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};
