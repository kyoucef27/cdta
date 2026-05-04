import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsService } from '../services/news.service';

export const NewsList = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await NewsService.getAll();
        const allNews = Array.isArray(res) ? res : res.data || [];
        // Only show published news, sorted by publish_date or created_at (newest first)
        const publishedNews = allNews
          .filter((n: any) => n.status === 'published')
          .sort((a: any, b: any) => {
            const dateA = new Date(a.publish_date || a.created_at).getTime();
            const dateB = new Date(b.publish_date || b.created_at).getTime();
            return dateB - dateA;
          });
        setNews(publishedNews);
      } catch (err) {
        console.error('Failed to fetch news', err);
        setError('Could not load the latest news. Please try again later.');
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 20px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5"
          style={{ animation: 'spin 0.75s linear infinite' }}>
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 style={{ 
          fontSize: 'clamp(36px, 5vw, 48px)', 
          fontWeight: 800, 
          color: '#0a0a0a', 
          margin: '0 0 16px',
          letterSpacing: '-0.03em'
        }}>
          Latest News
        </h1>
        <p style={{ fontSize: 18, color: '#555', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Stay updated with the latest announcements, breakthroughs, and insights from CDTA.
        </p>
      </div>

      {error ? (
        <div style={{ textAlign: 'center', color: '#ef4444', padding: 40, background: '#fef2f2', borderRadius: 16 }}>
          {error}
        </div>
      ) : news.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#555', padding: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📰</div>
          <p style={{ fontSize: 18 }}>No news articles published yet.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: 32 
        }}>
          {news.map((item) => (
            <div 
              key={item.id} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px -12px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Image Container */}
              <div style={{ height: 220, background: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                {item.image ? (
                  <img 
                    src={`http://localhost:8000/storage/${item.image}`} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                {/* Category Badge */}
                {item.category && (
                  <span style={{
                    position: 'absolute', top: 16, left: 16,
                    background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(4px)',
                    color: '#0a0a0a', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    padding: '6px 12px', borderRadius: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                  }}>
                    {item.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 28, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, fontSize: 13, color: '#555', fontWeight: 500 }}>
                  <span>{formatDate(item.publish_date || item.created_at)}</span>
                  {item.author && (
                    <>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#cbd5e1' }} />
                      <span>By {item.author}</span>
                    </>
                  )}
                </div>

                <h3 style={{ 
                  margin: '0 0 12px', fontSize: 20, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.4 
                }}>
                  <Link to={`/news/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {item.title}
                  </Link>
                </h3>

                <p style={{ 
                  margin: '0 0 24px', fontSize: 15, color: '#555', lineHeight: 1.6,
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {item.excerpt || item.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'}
                </p>

                {/* Read more link at bottom */}
                <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                  <Link to={`/news/${item.id}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: '#0a0a0a', fontSize: 14, fontWeight: 600, textDecoration: 'none'
                  }}>
                    Read full article
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
