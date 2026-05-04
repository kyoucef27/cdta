import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageService } from '../services/page.service';

export const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Combine cover image and gallery images
  const images = page ? [
    ...(page.image ? [page.image] : []),
    ...(Array.isArray(page.gallery) ? page.gallery : [])
  ] : [];

  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        // We fetch all pages and find the one matching the slug.
        // In a large production app, you'd add a dedicated GET /pages/slug/:slug endpoint to the backend.
        const res = await PageService.getAll();
        const pages = Array.isArray(res) ? res : res.data || [];
        
        const found = pages.find((p: any) => p.slug === slug && p.status === 'published');
        
        if (found) {
          setPage(found);
        } else {
          setError('Page not found or is not published.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5"
          style={{ animation: 'spin 0.75s linear infinite' }}>
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.25" />
          <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 20 
      }}>
        <div style={{ maxWidth: 600, textAlign: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 700, margin: '0 0 16px', color: '#fff', fontFamily: '"DM Serif Display", serif' }}>Oops!</h1>
          <p style={{ fontSize: 18, color: '#ccc', marginBottom: 32, fontFamily: '"Spectral", serif' }}>{error}</p>
          <Link to="/" style={{
            display: 'inline-flex', padding: '12px 24px', background: '#fff', color: '#000',
            textDecoration: 'none', borderRadius: 8, fontWeight: 600
          }}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#050505', // Deep academic charcoal
      position: 'relative',
    }}>
      <div style={{ maxWidth: 850, margin: '0 auto', padding: '120px 24px 100px', position: 'relative' }}>
        {/* Navigation & Breadcrumbs */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ 
            display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13, fontWeight: 500,
            transition: 'color 0.2s'
          }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK
          </Link>
          <div style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', fontWeight: 500, letterSpacing: '0.05em' }}>{page.title.toUpperCase()}</span>
        </div>
        
        {/* Page Title - Above Media */}
        {page.template !== 'fullscreen-image' && (
          <h1 style={{ 
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(32px, 5vw, 60px)', 
            fontWeight: 400, 
            color: '#ffffff', 
            lineHeight: 1.1,
            marginBottom: 40,
            marginTop: 0,
            letterSpacing: '0.01em',
            animation: 'fadeIn 0.8s ease'
          }}>
            {page.title}
          </h1>
        )}

        {/* Progress Bar */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)', zIndex: 1000
        }}>
          <div style={{ width: `${readingProgress}%`, height: '100%', background: '#ffffff', transition: 'width 0.1s ease-out' }} />
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=DM+Serif+Display&display=swap');

          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .dynamic-content { 
          font-family: "Spectral", "Georgia", "Times New Roman", serif; 
          color: #ffffff; 
          line-height: 1.8; 
          font-size: 20px; 
          font-weight: 400;
          animation: reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .dynamic-content h1, .dynamic-content h2, .dynamic-content h3 { 
          font-family: "DM Serif Display", serif;
          color: #ffffff; 
          margin-top: 2.2em; 
          margin-bottom: 0.8em; 
          font-weight: 400; 
          letter-spacing: 0.01em;
          position: relative;
        }

        .dynamic-content h2::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 2px;
          background: #ffffff;
          border-radius: 1px;
          opacity: 0.2;
          transition: width 0.3s ease;
        }
        .dynamic-content h2:hover::after { width: 60px; opacity: 1; }

        .dynamic-content p { margin-bottom: 2em; }
        
        .dynamic-content a { 
          color: #ffffff; 
          text-decoration: underline; 
          text-underline-offset: 4px;
          text-decoration-color: rgba(255,255,255,0.2);
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .dynamic-content a:hover { 
          text-decoration-color: #ffffff;
          background: rgba(255,255,255,0.05);
        }

        .dynamic-content ul, .dynamic-content ol { 
          margin-bottom: 2em; 
          padding-left: 1.5em; 
          list-style-type: none;
        }
        .dynamic-content li {
          position: relative;
          margin-bottom: 12px;
          padding-left: 24px;
        }
        .dynamic-content ul li::before {
          content: '•';
          position: absolute;
          left: 0;
          top: 0;
          color: #ffffff;
          opacity: 0.5;
        }

        .dynamic-content blockquote { 
          border-left: 2px solid #ffffff; 
          padding: 24px 32px;
          margin: 3em 0;
          background: rgba(255,255,255,0.03);
          border-radius: 0 4px 4px 0;
          color: #cccccc; 
          font-style: italic; 
          font-size: 1.1em;
        }

        .dynamic-content img { 
          max-width: 100%; 
          height: auto; 
          border-radius: 16px; 
          margin: 3em 0; 
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .dynamic-content img:hover { transform: scale(1.01); }
      `}</style>

      {images.length > 0 && (
        <div style={{ 
          marginBottom: page.content ? 40 : 0, 
          borderRadius: 20, 
          overflow: 'hidden', 
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          background: '#0a0a0a', 
          minHeight: (page.template === 'fullscreen-image' || !page.content) ? '70vh' : 300,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.5s ease'
        }}>
          {/* Carousel Track */}
          <div style={{
            display: 'flex',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${images.length * 100}%`
          }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ width: '100%', flexShrink: 0 }}>
                <img 
                  src={`http://localhost:8000/storage/${img}`} 
                  alt={`${page.title} - ${idx + 1}`}
                  style={{ 
                    width: '100%', 
                    maxHeight: (page.template === 'fullscreen-image' || !page.content) ? '85vh' : 650, 
                    objectFit: 'contain', 
                    display: 'block',
                    padding: (page.template === 'fullscreen-image' || !page.content) ? '20px' : 0
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 8,
              zIndex: 10
            }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: idx === currentSlide ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: idx === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}



      <div 
        className="dynamic-content"
        dangerouslySetInnerHTML={{ __html: page.content }} 
      />
    </div>
  </div>
);
};
