import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsService } from '../services/news.service';
import { ParticleBackground } from '../components/ParticleBackground';
import { EventHorizon } from '../components/EventHorizon';

export const Home = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await NewsService.getAll();
        const allNews = Array.isArray(res) ? res : res.data || [];
        const publishedNews = allNews
          .filter((n: any) => n.status === 'published')
          .sort((a: any, b: any) => new Date(b.publish_date || b.created_at).getTime() - new Date(a.publish_date || a.created_at).getTime())
          .slice(0, 3); // Take top 3
        setNews(publishedNews);
      } catch (err) {
        console.error('Failed to fetch news', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      
      {/* ── SECTION 1: HERO BANNER ── */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <ParticleBackground particleCount={150} />

        {/* Ambient Glowing Blob */}
        <div style={{
          position: 'absolute', top: '20%', left: '30%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(100px)',
        }} />

        {/* Subtle grid pattern overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 900, animation: 'fadeInUp 0.8s ease-out' }}>
          <style>{`
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
          `}</style>
          
          <h2 style={{ 
            fontSize: 'clamp(14px, 3vw, 18px)', 
            fontWeight: 600, 
            letterSpacing: '0.15em', 
            color: '#a3a3a3', // Light gray
            textTransform: 'uppercase',
            marginBottom: 24
          }}>
            Recherche, Technologie et Société
          </h2>
          
          <h1 style={{ 
            fontSize: 'clamp(36px, 6vw, 64px)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: 32,
            fontFamily: '"DM Serif Display", Georgia, serif'
          }}>
            Centre de Développement des Technologies Avancées
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(16px, 4vw, 20px)', 
            color: '#cbd5e1', // Subtle gray/blue
            lineHeight: 1.6,
            maxWidth: 700,
            margin: '0 auto',
            fontWeight: 400
          }}>
            Notre mission est de mener des actions de recherche scientifique, d'innovation technologique, de valorisation et de formation dans les domaines des sciences et des technologies.
          </p>

          <div style={{ marginTop: 48, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/news" style={{
              display: 'inline-flex', padding: '14px 28px', background: '#ffffff', color: '#0a0a0a',
              textDecoration: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16,
              transition: 'background 0.2s', boxShadow: '0 4px 14px rgba(255,255,255,0.2)'
            }} onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
              Discover Our Work
            </Link>
            <Link to="/about" style={{
              display: 'inline-flex', padding: '14px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff',
              textDecoration: 'none', borderRadius: 8, fontWeight: 600, fontSize: 16,
              border: '1px solid rgba(255,255,255,0.2)', transition: 'background 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', animation: 'float 3s ease-in-out infinite' }}>
          <svg width="24" height="24" fill="none" stroke="rgba(255,255,255,0.4)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      <EventHorizon />

      {/* ── SECTION 2: LATEST UPDATES ── */}
      <section style={{ padding: '100px 24px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                Latest Updates
              </h2>
              <p style={{ fontSize: 18, color: '#a3a3a3', margin: 0 }}>
                News, announcements, and technological breakthroughs.
              </p>
            </div>
            <Link to="/news" style={{
              display: 'flex', alignItems: 'center', gap: 6, color: '#ffffff', fontWeight: 600, textDecoration: 'none', fontSize: 15
            }}>
              View All News
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" style={{ animation: 'spin 0.75s linear infinite' }}>
                <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
                <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
              </svg>
            </div>
          ) : news.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#a3a3a3', padding: 60, background: '#121212', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ fontSize: 16 }}>No recent updates available.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 32 }}>
              {news.map((item) => (
                <div key={item.id} style={{
                  display: 'flex', flexDirection: 'column', background: '#121212', borderRadius: 16, overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  
                  <div style={{ height: 220, background: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
                    {item.image ? (
                      <img src={`http://localhost:8000/storage/${item.image}`} alt={item.title} 
                           style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#444' }}>
                        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#a3a3a3', fontWeight: 500, marginBottom: 12 }}>
                      {formatDate(item.publish_date || item.created_at)}
                    </div>
                    <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
                      <Link to={`/news/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {item.title}
                      </Link>
                    </h3>
                    <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                      <Link to={`/news/${item.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ffffff', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                        Read article
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
          
          <div style={{ textAlign: 'center', marginTop: 48, display: 'none' /* hidden on desktop, used for mobile maybe */ }}>
            <Link to="/news" style={{ display: 'inline-block', padding: '12px 24px', background: '#ffffff', border: 'none', borderRadius: 8, color: '#0a0a0a', fontWeight: 600, textDecoration: 'none' }}>
              View All News
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
