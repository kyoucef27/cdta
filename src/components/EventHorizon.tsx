import React, { useEffect, useState, useMemo, useRef } from 'react';
import { EventService } from '../services/event.service';
import { Link } from 'react-router-dom';
import { usePublic } from '../contexts/PublicContext';

const LightningParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: any[] = [];
    let bolts: any[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.maxLife = Math.random() * 20 + 10;
        this.life = this.maxLife;
        this.size = Math.random() * 1.5 + 0.5;
        const colors = ['#f5f3ff', '#ddd6fe', '#c4b5fd', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        // electrical jitter
        this.vx += (Math.random() - 0.5) * 3;
        this.vy += (Math.random() - 0.5) * 3;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.life / this.maxLife), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class LightningBolt {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      life: number;
      maxLife: number;
      segments: {x: number, y: number}[];

      constructor() {
        // start from edges or random points
        if (Math.random() > 0.5) {
          this.startX = Math.random() * canvas.width;
          this.startY = Math.random() > 0.5 ? 0 : canvas.height;
        } else {
          this.startX = Math.random() > 0.5 ? 0 : canvas.width;
          this.startY = Math.random() * canvas.height;
        }
        
        this.endX = this.startX + (Math.random() - 0.5) * 350;
        this.endY = this.startY + (Math.random() - 0.5) * 350;
        
        this.maxLife = Math.floor(Math.random() * 8) + 4; // very quick flash
        this.life = this.maxLife;
        this.segments = this.generateSegments();
        
        // spark explosion at the end
        if (Math.random() > 0.2) {
          const numSparks = Math.floor(Math.random() * 10) + 5;
          for(let i=0; i<numSparks; i++) {
            particles.push(new Spark(this.endX, this.endY));
          }
        }
      }

      generateSegments() {
        const segs = [{x: this.startX, y: this.startY}];
        const steps = Math.floor(Math.random() * 6) + 4;
        for(let i=1; i<=steps; i++) {
          const t = i / steps;
          const targetX = this.startX + (this.endX - this.startX) * t;
          const targetY = this.startY + (this.endY - this.startY) * t;
          segs.push({
            x: targetX + (Math.random() - 0.5) * 50, 
            y: targetY + (Math.random() - 0.5) * 50
          });
        }
        segs.push({x: this.endX, y: this.endY});
        return segs;
      }

      update() {
        this.life--;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        for(let i=1; i<this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        
        // Flickering effect based on life
        const alpha = (this.life % 2 === 0) ? 0.9 : 0.3;
        
        ctx.strokeStyle = `rgba(221, 214, 254, ${alpha})`;
        ctx.lineWidth = Math.random() * 2 + 1;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#a855f7';
        ctx.stroke();
        
        // Inner white core
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Spawn bolts occasionally
      if (Math.random() < 0.05) {
        bolts.push(new LightningBolt());
      }

      bolts = bolts.filter(b => b.life > 0);
      bolts.forEach(b => {
        b.update();
        b.draw(ctx);
      });

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.7 // Subtle overall opacity
      }} 
    />
  );
};


export const EventHorizon = () => {
  const { cache, setPublicCache } = usePublic();
  const [loading, setLoading] = useState(!cache.events);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await EventService.getAll();
        const allEvents = Array.isArray(res) ? res : res.data || [];
        setPublicCache('events', allEvents);
      } catch (err) {
        console.error('Event Horizon fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [setPublicCache]);

  const events = useMemo(() => {
    if (!cache.events) return [];
    return [...cache.events]
      .filter((e: any) => e.status === 'published')
      .sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
      .slice(0, 4);
  }, [cache.events]);


  if (!loading && events.length === 0) return null;

  return (
    <section style={{ 
      padding: '80px 24px', 
      background: '#0a0d14', // Slightly blue-tinted dark background for lightning theme
      overflow: 'hidden',
      position: 'relative'
    }}>
      <LightningParticles />
      
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ marginBottom: 48, textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: 34, fontWeight: 700, color: '#ffffff', 
            fontFamily: '"DM Serif Display", serif', marginBottom: 8,
            letterSpacing: '-0.01em',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
          }}>
            Upcoming Events
          </h2>
          <p style={{ 
            fontSize: 15, color: '#94a3b8', margin: 0, fontWeight: 400 
          }}>
            Stay up to date with our latest sessions and conferences.
          </p>
        </div>

        {/* Cards — centered with flexbox wrap */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center', 
          gap: 24, 
          padding: '4px'
        }}>
          {events.map((event) => (
            <Link 
              key={event.id}
              to={`/events/${event.id}`}
              className="event-card-clean"
              style={{
                flex: '0 0 280px',
                maxWidth: 320,
                position: 'relative',
                borderRadius: 16,
                padding: '2px', // space for the animated border
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.25s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                background: '#0a0d14', // same as section bg
              }}
            >
              <div className="card-border-particle" />
              
              <div style={{
                background: '#131824',
                borderRadius: 14,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                height: '100%',
                position: 'relative',
                zIndex: 2,
              }}>
                {/* Date Badge */}
                <div className="event-date-badge" style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: '#1e293b',
                  border: '1px solid rgba(168, 85, 247, 0.15)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>
                    {new Date(event.start_date).getDate()}
                  </span>
                  <span style={{ fontSize: 9, textTransform: 'uppercase', color: '#94a3b8' }}>
                    {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </div>

                <div>
                  <h3 style={{ 
                    fontSize: 18, fontWeight: 700, color: '#f8fafc', margin: '0 0 8px',
                    fontFamily: '"DM Serif Display", serif', lineHeight: 1.3
                  }}>
                    {event.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {event.location || 'CDTA Campus'}
                  </div>
                </div>

                <div style={{ 
                  marginTop: 'auto', fontSize: 13, color: '#94a3b8', 
                  lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, 
                  WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                }}>
                  {event.description?.replace(/<[^>]*>/g, '') || 'Join us for this technological session.'}
                </div>

                <div className="event-learn-more" style={{ 
                  display: 'flex', alignItems: 'center', gap: 6, 
                  color: '#a855f7', fontSize: 13, fontWeight: 600, 
                  letterSpacing: '0.02em', transition: 'text-shadow 0.3s ease' 
                }}>
                  Learn More
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .card-border-particle {
          position: absolute;
          inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 40%,
            rgba(168, 85, 247, 0.2) 45%,
            #a855f7 49%,
            #ffffff 50%,
            transparent 51%,
            transparent 90%,
            rgba(168, 85, 247, 0.2) 95%,
            #a855f7 99%,
            #ffffff 100%
          );
          animation: spinParticle 4s linear infinite;
          z-index: 1;
        }

        @keyframes spinParticle {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .event-card-clean:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.7) !important;
        }

        .event-card-clean:hover .card-border-particle {
          animation-duration: 1.5s;
        }

        .event-card-clean:hover .event-date-badge {
          background: #a855f7 !important;
          border-color: #c4b5fd !important;
          color: #ffffff !important;
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.6);
        }

        .event-card-clean:hover .event-date-badge span {
          color: #0f172a !important;
        }

        .event-card-clean:hover .event-learn-more {
          text-shadow: 0 0 8px rgba(168, 85, 247, 0.8);
          color: #c4b5fd !important;
        }
      `}</style>
    </section>
  );
};
