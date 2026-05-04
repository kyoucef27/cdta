import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NewsService } from '../services/news.service';

export const NewsArticle = () => {
  const { id } = useParams();
  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const res = await NewsService.getById(id!);
        // The API might return { data: ... } or the raw object
        const data = res.data ?? res;
        
        if (data && data.status === 'published') {
          setNews(data);
        } else {
          setError('News article not found or is not published.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load the article.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
      <div style={{ padding: '100px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5"
          style={{ animation: 'spin 0.75s linear infinite', margin: '0 auto' }}>
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={{ maxWidth: 600, margin: '120px auto', textAlign: 'center', padding: 20 }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, margin: '0 0 16px', color: '#0a0a0a' }}>Oops!</h1>
        <p style={{ fontSize: 18, color: '#555', marginBottom: 32 }}>{error}</p>
        <Link to="/news" style={{
          display: 'inline-flex', padding: '14px 28px', background: '#0a0a0a', color: '#fff',
          textDecoration: 'none', borderRadius: 8, fontWeight: 600, transition: 'background 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'} onMouseLeave={e => e.currentTarget.style.background = '#0a0a0a'}>
          Back to News
        </Link>
      </div>
    );
  }

  // Parse additional images
  let gallery: string[] = [];
  if (Array.isArray(news.additional_images)) {
    gallery = news.additional_images;
  } else if (typeof news.additional_images === 'string') {
    try { gallery = JSON.parse(news.additional_images); } catch(e) {}
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: 100 }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .article-content { font-family: "DM Sans", system-ui, sans-serif; color: #1a1a1a; line-height: 1.85; font-size: 18px; }
        .article-content h2, .article-content h3 { color: #0a0a0a; margin-top: 2.5em; margin-bottom: 1em; font-weight: 800; letter-spacing: -0.01em; }
        .article-content p { margin-bottom: 1.8em; }
        .article-content a { color: #0a0a0a; text-decoration: underline; font-weight: 500; }
        .article-content ul, .article-content ol { margin-bottom: 1.8em; padding-left: 1.5em; }
        .article-content li { margin-bottom: 0.5em; }
        .article-content blockquote { border-left: 4px solid #0a0a0a; padding-left: 20px; color: #444; font-style: italic; font-size: 1.1em; background: #fafafa; padding: 24px; border-radius: 0 12px 12px 0; margin: 2em 0; }
        .article-content img { max-width: 100%; height: auto; border-radius: 16px; margin: 2.5em 0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
      `}</style>

      {/* Main Cover Image */}
      {news.image && (
        <div style={{ width: '100%', height: '65vh', position: 'relative', background: '#111' }}>
          <img 
            src={`http://localhost:8000/storage/${news.image}`} 
            alt={news.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
          
          {/* Headline over image */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.8s cubic-bezier(0.22,1,0.36,1)' }}>
              {news.category && (
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 20 }}>
                  {news.category}
                </span>
              )}
              <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, margin: '0 0 24px', letterSpacing: '-0.02em', fontFamily: '"DM Serif Display", Georgia, serif' }}>
                {news.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#ccc', fontSize: 15, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {news.author || 'CDTA'}
                </span>
                <span>•</span>
                <span>{formatDate(news.published_at || news.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No cover image fallback header */}
      {!news.image && (
        <div style={{ paddingTop: 140, paddingBottom: 40, paddingLeft: 24, paddingRight: 24, textAlign: 'center', background: '#fafafa', borderBottom: '1px solid #eaeaea' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', animation: 'fadeIn 0.6s ease' }}>
            {news.category && (
              <span style={{ display: 'inline-block', background: '#0a0a0a', color: '#fff', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 20 }}>
                {news.category}
              </span>
            )}
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, color: '#0a0a0a', lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-0.02em', fontFamily: '"DM Serif Display", Georgia, serif' }}>
              {news.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#666', fontSize: 15, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                {news.author || 'CDTA'}
              </span>
              <span>•</span>
              <span>{formatDate(news.published_at || news.created_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '60px 24px', animation: 'fadeIn 0.8s ease' }}>
        
        {/* Excerpt */}
        {news.excerpt && (
          <p style={{ fontSize: 22, color: '#444', lineHeight: 1.6, fontWeight: 400, marginBottom: 48, fontStyle: 'italic', borderBottom: '1px solid #eaeaea', paddingBottom: 40 }}>
            {news.excerpt}
          </p>
        )}

        {/* Body HTML */}
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: news.content }} 
        />

        {/* Gallery Grid */}
        {gallery.length > 0 && (
          <div style={{ marginTop: 80, borderTop: '1px solid #eaeaea', paddingTop: 60 }}>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: '#0a0a0a', marginBottom: 32 }}>Image Gallery</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: gallery.length === 1 ? '1fr' : gallery.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 20 
            }}>
              {gallery.map((img, idx) => (
                <div key={idx} style={{ 
                  borderRadius: 16, overflow: 'hidden', background: '#f5f5f5', 
                  aspectRatio: gallery.length === 1 ? '16/9' : '4/3', cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <a href={`http://localhost:8000/storage/${img}`} target="_blank" rel="noreferrer">
                    <img 
                      src={`http://localhost:8000/storage/${img}`} 
                      alt={`Gallery ${idx + 1}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
