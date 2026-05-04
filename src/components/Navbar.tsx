import React, { useState, useEffect, useRef } from 'react';
import { useNav } from '../hooks/useNav';
import { Link } from 'react-router-dom';
import { EventService } from '../services/event.service';
import type { NavChild } from '../types/nav';

// ─── Motion tokens ────────────────────────────────────────────────────────────
const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

// ─── Inline styles ────────────────────────────────────────────────────────────
const styles = {
  // Nav shell
  nav: (scrolled: boolean): React.CSSProperties => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    transition: `background 0.4s ${ease}, box-shadow 0.4s ${ease}, border-color 0.4s ${ease}`,
    background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
  }),

  inner: (): React.CSSProperties => ({
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 68,
    gap: 32,
  }),

  // Logo
  logo: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    flexShrink: 0,
    letterSpacing: '-0.03em',
  }),
  logoText: (): React.CSSProperties => ({
    fontFamily: '"DM Serif Display", Georgia, serif',
    fontSize: 26,
    fontWeight: 400,
    color: '#ffffff',
    lineHeight: 1,
  }),
  logoArrow: (hovered: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: hovered ? '#ffffff' : 'transparent',
    border: '1.5px solid #ffffff',
    transition: `all 0.25s ${ease}`,
    transform: hovered ? 'rotate(45deg)' : 'none',
  }),
  logoArrowSvg: (hovered: boolean): React.CSSProperties => ({
    width: 14,
    height: 14,
    color: hovered ? '#0a0a0a' : '#ffffff',
    transition: `color 0.25s ${ease}`,
  }),

  // Desktop nav list
  desktopList: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    flex: 1,
    justifyContent: 'center',
  }),

  // Nav item button
  navBtn: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '7px 14px',
    borderRadius: 8,
    border: 'none',
    background: active ? '#1a1a1a' : 'transparent',
    color: active ? '#ffffff' : '#a3a3a3',
    fontSize: 13.5,
    fontWeight: 500,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: `all 0.2s ${ease}`,
    whiteSpace: 'nowrap' as const,
  }),

  // Ticker (Top Bar version)
  tickerBar: (scrolled: boolean): React.CSSProperties => ({
    background: 'rgba(0,0,0,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: `all 0.3s ${ease}`,
    overflow: 'hidden',
    opacity: scrolled ? 0 : 1,
    marginTop: scrolled ? -36 : 0,
    pointerEvents: scrolled ? 'none' : 'auto',
  }),
  ticker: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    transition: `all 0.3s ${ease}`,
  }),
  tickerLabel: (): React.CSSProperties => ({
    color: '#a855f7',
    fontSize: 10,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),
  tickerBadge: (): React.CSSProperties => ({
    background: '#a855f7',
    width: 6,
    height: 6,
    borderRadius: '50%',
    boxShadow: '0 0 10px #a855f7',
    flexShrink: 0,
    animation: 'cdta-pulse 2s infinite',
  }),
  tickerText: (): React.CSSProperties => ({
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: 500,
    fontFamily: '"DM Sans", sans-serif',
  }),

  // Chevron icon
  chevron: (open: boolean): React.CSSProperties => ({
    width: 14,
    height: 14,
    transition: `transform 0.25s ${ease}`,
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    flexShrink: 0,
  }),

  // Right actions
  actions: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  }),

  ctaBtn: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 18px',
    borderRadius: 8,
    border: 'none',
    background: '#ffffff',
    color: '#0a0a0a',
    fontSize: 13.5,
    fontWeight: 500,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: `all 0.2s ${ease}`,
  }),

  // ── Mega dropdown panel ──────────────────────────────────────────────────────
  dropdownWrap: (open: boolean): React.CSSProperties => ({
    position: 'absolute' as const,
    top: 'calc(100% + 12px)',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    pointerEvents: open ? 'auto' : 'none',
    opacity: open ? 1 : 0,
    transition: `opacity 0.2s ${ease}, transform 0.2s ${ease}`,
    transformOrigin: 'top center',
  }),

  dropdownPanel: (): React.CSSProperties => ({
    background: '#121212',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3), 0 24px 48px -8px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    minWidth: 560,
    maxWidth: 880,
    display: 'flex',
  }),

  // Intro card (dark sidebar)
  introCard: (): React.CSSProperties => ({
    width: 200,
    flexShrink: 0,
    background: '#0a0a0a',
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
    gap: 12,
    position: 'relative' as const,
    overflow: 'hidden',
  }),

  introCardDot: (top: string, left: string, size: number, opacity: number): React.CSSProperties => ({
    position: 'absolute' as const,
    top, left,
    width: size,
    height: size,
    borderRadius: '50%',
    background: `rgba(255,255,255,${opacity})`,
    pointerEvents: 'none' as const,
  }),

  introCardBtn: (): React.CSSProperties => ({
    display: 'block',
    padding: '9px 16px',
    borderRadius: 8,
    background: '#fff',
    color: '#0a0a0a',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    textAlign: 'center' as const,
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    transition: `opacity 0.15s ${ease}`,
  }),

  // Sections area
  sectionsWrap: (): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    gap: 0,
    padding: '24px 8px',
    maxHeight: '75vh',
    overflowY: 'auto' as const,
  }),

  sectionCol: (): React.CSSProperties => ({
    flex: '1 1 160px',
    minWidth: 140,
    padding: '0 16px',
    borderRight: '1px solid rgba(255,255,255,0.05)',
  }),

  sectionColLast: (): React.CSSProperties => ({
    flex: '1 1 160px',
    minWidth: 140,
    padding: '0 16px',
  }),

  sectionHeading: (): React.CSSProperties => ({
    fontSize: 10.5,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: '#666',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    marginBottom: 10,
    paddingLeft: 10,
  }),

  // Dropdown link item
  dropLink: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '7px 10px',
    borderRadius: 7,
    textDecoration: 'none',
    color: '#e5e5e5',
    fontSize: 13.5,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 450,
    letterSpacing: '-0.01em',
    transition: `background 0.15s ${ease}, color 0.15s ${ease}`,
    cursor: 'pointer',
  }),

  // Nested expand button (parent with children)
  nestedBtn: (open: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '7px 10px',
    borderRadius: 7,
    background: open ? '#1a1a1a' : 'transparent',
    border: 'none',
    color: '#e5e5e5',
    fontSize: 13.5,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 450,
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: `background 0.15s ${ease}`,
    textAlign: 'left' as const,
  }),

  nestedChildren: (open: boolean): React.CSSProperties => ({
    overflow: 'hidden',
    maxHeight: open ? 500 : 0,
    opacity: open ? 1 : 0,
    transition: `max-height 0.3s ${ease}, opacity 0.2s ${ease}`,
    paddingLeft: 16,
    marginTop: open ? 2 : 0,
  }),

  childLink: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
    borderRadius: 6,
    textDecoration: 'none',
    color: '#a3a3a3',
    fontSize: 13,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 400,
    transition: `color 0.15s ${ease}, background 0.15s ${ease}`,
  }),

  // ── Mobile hamburger ─────────────────────────────────────────────────────────
  hamburger: (): React.CSSProperties => ({
    display: 'none',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    gap: 5,
    width: 36,
    height: 36,
    padding: 6,
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    cursor: 'pointer',
  }),

  hamburgerLine: (): React.CSSProperties => ({
    width: '100%',
    height: 1.5,
    background: '#ffffff',
    borderRadius: 2,
  }),

  // ── Mobile drawer ────────────────────────────────────────────────────────────
  drawerOverlay: (open: boolean): React.CSSProperties => ({
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(4px)',
    zIndex: 60,
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: `opacity 0.3s ${ease}`,
  }),

  drawer: (open: boolean): React.CSSProperties => ({
    position: 'fixed' as const,
    top: 0,
    right: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 380,
    background: '#0a0a0a',
    zIndex: 70,
    transform: open ? 'translateX(0)' : 'translateX(100%)',
    transition: `transform 0.35s ${ease}`,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  }),

  drawerHeader: (): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: 64,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    flexShrink: 0,
  }),

  drawerCloseBtn: (): React.CSSProperties => ({
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'transparent',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }),

  drawerScroll: (): React.CSSProperties => ({
    flex: 1,
    overflowY: 'auto' as const,
    padding: '12px 16px 32px',
  }),

  // Mobile section row
  mobileSectionBtn: (open: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    background: open ? '#1a1a1a' : 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: 15,
    fontFamily: '"DM Sans", system-ui, sans-serif',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: `background 0.2s ${ease}`,
    textAlign: 'left' as const,
  }),

  mobileSectionContent: (open: boolean): React.CSSProperties => ({
    overflow: 'hidden',
    maxHeight: open ? 2000 : 0,
    opacity: open ? 1 : 0,
    transition: `max-height 0.4s ${ease}, opacity 0.25s ${ease}`,
  }),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function ExternalIcon() {
  return (
    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.4, flexShrink: 0 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function ChevronIcon({ open, size = 14 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={styles.chevron(open)}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Dropdown link renderer ──────────────────────────────────────────────────

function DropdownLinks({
  items,
  openChildItems,
  toggleChildItem,
  closeAll,
}: {
  items: NavChild[];
  openChildItems: number[];
  toggleChildItem: (id: number, e: React.MouseEvent) => void;
  closeAll: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [hoveredChildId, setHoveredChildId] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isChildOpen = openChildItems.includes(item.id);
        const isHovered = hoveredId === item.id;

        return (
          <React.Fragment key={item.id}>
            {hasChildren ? (
              <div>
                <button
                  style={{
                    ...styles.nestedBtn(isChildOpen),
                    background: isChildOpen || isHovered ? '#1a1a1a' : 'transparent',
                  }}
                  onClick={(e) => toggleChildItem(item.id, e)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span>{item.label}</span>
                  <ChevronIcon open={isChildOpen} size={13} />
                </button>
                <div style={styles.nestedChildren(isChildOpen)}>
                  {item.children!.map((child) => {
                    const cHovered = hoveredChildId === child.id;
                    return (
                      <a
                        key={child.id}
                        href={child.url}
                        onClick={closeAll}
                        style={{
                          ...styles.childLink(),
                          background: cHovered ? '#1a1a1a' : 'transparent',
                          color: cHovered ? '#ffffff' : '#a3a3a3',
                        }}
                        target={child.is_external ? '_blank' : '_self'}
                        rel={child.is_external ? 'noreferrer' : undefined}
                        onMouseEnter={() => setHoveredChildId(child.id)}
                        onMouseLeave={() => setHoveredChildId(null)}
                      >
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            background: cHovered ? '#ffffff' : '#444',
                            flexShrink: 0,
                            transition: 'background 0.15s',
                          }}
                        />
                        {child.label}
                        {child.is_external && <ExternalIcon />}
                      </a>
                    );
                  })}
                </div>
              </div>
            ) : (
              <a
                href={item.url}
                onClick={closeAll}
                style={{
                  ...styles.dropLink(),
                  background: isHovered ? '#1a1a1a' : 'transparent',
                  color: isHovered ? '#ffffff' : '#e5e5e5',
                }}
                target={item.is_external ? '_blank' : '_self'}
                rel={item.is_external ? 'noreferrer' : undefined}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span>{item.label}</span>
                {item.is_external && <ExternalIcon />}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export const Navbar = () => {
  const { navData, loading: navLoading } = useNav();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<number | null>(null);
  const [openChildItems, setOpenChildItems] = useState<number[]>([]);
  const [logoHovered, setLogoHovered] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // ── Ticker State ─────────────────────────────────────────────────────────────
  const [tickerEvents, setTickerEvents] = useState<any[]>([]);
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const fetchTickerEvents = async () => {
      try {
        const res = await EventService.getAll();
        const all = Array.isArray(res) ? res : res.data || [];
        setTickerEvents(all.filter((e: any) => e.status === 'published').slice(0, 3));
      } catch (err) {
        console.error('Ticker fetch failed', err);
      }
    };
    fetchTickerEvents();
  }, []);

  useEffect(() => {
    if (tickerEvents.length > 1) {
      const timer = setInterval(() => {
        setTickerIndex((prev) => (prev + 1) % tickerEvents.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [tickerEvents]);

  // ── Scroll listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // ── Global click / Escape ────────────────────────────────────────────────────
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const toggleDropdown = (id: number) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  const toggleMobileSection = (id: number) =>
    setOpenMobileSection((prev) => (prev === id ? null : id));

  const toggleChildItem = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenChildItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const closeAll = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  // ── Font loader (DM Sans + DM Serif Display) ─────────────────────────────────
  useEffect(() => {
    if (document.getElementById('cdta-fonts')) return;
    const link = document.createElement('link');
    link.id = 'cdta-fonts';
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&family=DM+Serif+Display&display=swap';
    document.head.appendChild(link);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Font keyframes & responsive hamburger show/hide */}
      <style>{`
        @keyframes cdta-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (max-width: 1023px) {
          .cdta-desktop { display: none !important; }
          .cdta-hamburger { display: flex !important; }
        }
        .cdta-nav-btn:hover { background: #1a1a1a !important; color: #ffffff !important; }
        .cdta-cta:hover { opacity: 0.85 !important; }
        .cdta-intro-btn:hover { opacity: 0.88 !important; }
        .cdta-drawer-close:hover { background: #1a1a1a !important; }
      `}</style>

      {/* Desktop dropdown backdrop */}
      {openDropdown !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.08)',
            zIndex: 40,
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* ── NAV BAR ─────────────────────────────────────────────────────────── */}
      <nav ref={navRef} style={styles.nav(scrolled)}>
        {/* Ticker Top Bar */}
        <div style={styles.tickerBar(scrolled)} className="cdta-desktop">
          {tickerEvents.length > 0 && (
            <Link 
              to={`/events/${tickerEvents[tickerIndex].id}`}
              style={styles.ticker()}
            >
              <div style={styles.tickerLabel()}>
                <div style={styles.tickerBadge()} />
                Upcoming Event
              </div>
              <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.15)' }} />
              <span style={styles.tickerText()}>
                {tickerEvents[tickerIndex].title}
              </span>
            </Link>
          )}
        </div>
        <div style={styles.inner()}>

          {/* Logo */}
          {/* Logo */}
          <a
            href="/"
            style={styles.logo()}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <img
              src="/logo.png"
              alt="CDTA"
              style={{
                height: 76,
                width: 'auto',
                display: 'block',
                filter: 'brightness(0) invert(1)',
                transition: `opacity 0.2s ${ease}, transform 0.2s ${ease}`,
                opacity: logoHovered ? 0.85 : 1,
                transform: logoHovered ? 'scale(1.03)' : 'scale(1)',
              }}
            />
          </a>

          {/* Desktop nav list */}
          {(navData.length > 0) && (
            <ul className="cdta-desktop" style={styles.desktopList()}>
              {navData.map((item) => {
                const isOpen = openDropdown === item.id;
                const hasDropdown = !!(item.sections?.length);
                const isHovered = hoveredNavItem === item.id;

                return (
                  <li key={item.id} style={{ position: 'relative', listStyle: 'none' }}>
                    <button
                      className="cdta-nav-btn"
                      style={styles.navBtn(isOpen || isHovered)}
                      onClick={() => hasDropdown && toggleDropdown(item.id)}
                      onMouseEnter={() => setHoveredNavItem(item.id)}
                      onMouseLeave={() => setHoveredNavItem(null)}
                    >
                      {item.label}
                      {hasDropdown && <ChevronIcon open={isOpen} />}
                    </button>

                    {/* Mega dropdown */}
                    {hasDropdown && (
                      <div style={styles.dropdownWrap(isOpen)}>
                        <div style={styles.dropdownPanel()}>

                          {/* Intro card */}
                          {item.has_intro_card && (
                            <div style={styles.introCard()}>
                              {/* Decorative circles */}
                              <div style={styles.introCardDot('-20px', '-20px', 100, 0.04)} />
                              <div style={styles.introCardDot('60px', '80px', 60, 0.06)} />
                              <div style={styles.introCardDot('120px', '-10px', 40, 0.05)} />

                              {/* Label */}
                              <div style={{
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase' as const,
                                color: 'rgba(255,255,255,0.35)',
                                fontFamily: '"DM Sans", system-ui, sans-serif',
                                position: 'relative',
                              }}>
                                {item.label}
                              </div>

                              {item.intro_card_button_label && (
                                <a
                                  href={item.intro_card_url || '#'}
                                  className="cdta-intro-btn"
                                  style={styles.introCardBtn()}
                                  onClick={closeAll}
                                >
                                  {item.intro_card_button_label}
                                </a>
                              )}
                            </div>
                          )}

                          {/* Sections */}
                          <div style={styles.sectionsWrap()}>
                            {item.sections?.map((section, idx) => {
                              const isLast = idx === (item.sections!.length - 1);
                              return (
                                <div key={idx} style={isLast ? styles.sectionColLast() : styles.sectionCol()}>
                                  {section.heading && (
                                    <div style={styles.sectionHeading()}>{section.heading}</div>
                                  )}
                                  <DropdownLinks
                                    items={section.items}
                                    openChildItems={openChildItems}
                                    toggleChildItem={toggleChildItem}
                                    closeAll={closeAll}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {/* Right area: CTA + hamburger */}
          <div style={styles.actions()}>
            <a href="/contact" className="cdta-cta cdta-desktop" style={styles.ctaBtn()}>
              Get in touch
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            {/* Hamburger */}
            <button
              className="cdta-hamburger cdta-drawer-close"
              style={{ ...styles.hamburger(), display: 'none' }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span style={styles.hamburgerLine()} />
              <span style={styles.hamburgerLine()} />
              <span style={{ ...styles.hamburgerLine(), width: '60%' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ───────────────────────────────────────────────────── */}
      <div style={styles.drawerOverlay(mobileOpen)} onClick={() => setMobileOpen(false)} />

      <div style={styles.drawer(mobileOpen)}>
        {/* Header */}
        <div style={styles.drawerHeader()}>
          <a href="/" style={styles.logo()} onClick={() => setMobileOpen(false)}>
            <img
              src="/logo.png"
              alt="CDTA"
              style={{ height: 64, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
            />
          </a>
          <button
            className="cdta-drawer-close"
            style={styles.drawerCloseBtn()}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav */}
        <div style={styles.drawerScroll()}>
          {navData.length > 0 && navData.map((item, idx) => {
            const hasDropdown = !!(item.sections?.length);
            const isOpen = openMobileSection === item.id;

            return (
              <div
                key={item.id}
                style={{
                  borderBottom: idx < navData.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  marginBottom: 4,
                }}
              >
                {hasDropdown ? (
                  <button
                    style={styles.mobileSectionBtn(isOpen)}
                    onClick={() => toggleMobileSection(item.id)}
                  >
                    <span>{item.label}</span>
                    <ChevronIcon open={isOpen} size={16} />
                  </button>
                ) : (
                  <a
                    href={item.url}
                    style={{
                      ...styles.mobileSectionBtn(false),
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                )}

                {/* Expanded mobile section */}
                {hasDropdown && (
                  <div style={styles.mobileSectionContent(isOpen)}>
                    <div style={{ paddingBottom: 12 }}>
                      {/* Intro card strip */}
                      {item.has_intro_card && item.intro_card_button_label && (
                        <div style={{
                          margin: '8px 4px 12px',
                          borderRadius: 10,
                          background: '#0a0a0a',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.5)',
                            fontFamily: '"DM Sans", system-ui, sans-serif',
                          }}>{item.label}</span>
                          <a
                            href={item.intro_card_url || '#'}
                            onClick={() => setMobileOpen(false)}
                            style={{
                              padding: '7px 14px',
                              borderRadius: 7,
                              background: '#fff',
                              color: '#0a0a0a',
                              fontSize: 12.5,
                              fontWeight: 600,
                              fontFamily: '"DM Sans", system-ui, sans-serif',
                              textDecoration: 'none',
                            }}
                          >
                            {item.intro_card_button_label}
                          </a>
                        </div>
                      )}

                      {/* Sections */}
                      {item.sections?.map((section, sidx) => (
                        <div key={sidx} style={{ marginBottom: 8 }}>
                          {section.heading && (
                            <div style={{
                              ...styles.sectionHeading(),
                              paddingLeft: 14,
                              marginBottom: 6,
                            }}>
                              {section.heading}
                            </div>
                          )}
                          <DropdownLinks
                            items={section.items}
                            openChildItems={openChildItems}
                            toggleChildItem={toggleChildItem}
                            closeAll={closeAll}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile CTA */}
          <div style={{ marginTop: 20 }}>
            <a
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{
                ...styles.ctaBtn(),
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                borderRadius: 10,
                padding: '13px 20px',
                fontSize: 15,
              }}
            >
              Get in touch
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginLeft: 8 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};