import React, { useState } from 'react';
import { MessageService } from '../services/message.service';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await MessageService.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', color: '#fff', paddingBottom: 100 }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .contact-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 18px; color: #fff; font-family: "DM Sans", sans-serif; font-size: 15px; transition: all 0.2s; outline: none; }
        .contact-input:focus { border-color: #a855f7; background: rgba(168,85,247,0.05); }
        .contact-label { display: block; font-size: 13px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* ── HERO SECTION ── */}
      <section style={{
        padding: '140px 24px 80px',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, rgba(168,85,247,0.12) 0%, transparent 70%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', animation: 'fadeInUp 0.8s ease' }}>
          <h1 style={{ 
            fontSize: 'clamp(40px, 8vw, 72px)', 
            fontFamily: '"DM Serif Display", serif', 
            fontWeight: 400,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            color: '#ffffff'
          }}>
            Get in Touch
          </h1>
          <p style={{ 
            fontSize: 'clamp(16px, 3vw, 20px)', 
            color: '#94a3b8', 
            maxWidth: 600, 
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Have questions about our research, events, or partnerships? Our team is here to help.
          </p>
        </div>
      </section>

      {/* ── CONTENT SECTION ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
        
        {/* Contact Info */}
        <div style={{ animation: 'fadeInUp 1s ease' }}>
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 24, fontFamily: '"DM Serif Display", serif', marginBottom: 24 }}>Information de Contact</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Adresse</div>
                  <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.5 }}>Cité 20 août 1956 Baba Hassen, Alger, Algérie</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Téléphone & Fax</div>
                  <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.5 }}>+213(0) 23 35 22 60<br/>+213(0) 23 35 22 63</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Email</div>
                  <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.5 }}>contact@cdta.dz</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suivez-nous</h4>
            <div style={{ display: 'flex', gap: 12 }}>
              {['facebook', 'twitter', 'linkedin', 'youtube'].map(social => (
                <a key={social} href={`#${social}`} style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}>
                  <i className={`fa fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: '#0a0a0a', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', animation: 'fadeInUp 1.2s ease' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(52,211,153,0.1)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Message Sent!</h3>
              <p style={{ color: '#94a3b8', marginBottom: 32 }}>Thank you for reaching out. We will get back to you shortly.</p>
              <button 
                onClick={() => setSuccess(false)}
                style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label className="contact-label">Nom Complet</label>
                  <input 
                    name="name" 
                    type="text" 
                    required 
                    className="contact-input" 
                    placeholder="John Doe" 
                    value={formData.name} 
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="contact-label">Email</label>
                  <input 
                    name="email" 
                    type="email" 
                    required 
                    className="contact-input" 
                    placeholder="john@example.com" 
                    value={formData.email} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="contact-label">Sujet</label>
                <input 
                  name="subject" 
                  type="text" 
                  className="contact-input" 
                  placeholder="How can we help?" 
                  value={formData.subject} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="contact-label">Message</label>
                <textarea 
                  name="message" 
                  required 
                  className="contact-input" 
                  style={{ minHeight: 150, resize: 'vertical' }} 
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              {error && <div style={{ color: '#f87171', fontSize: 14, fontWeight: 500 }}>{error}</div>}
              
              <button 
                type="submit" 
                disabled={loading}
                className="submit-btn"
                style={{ 
                  marginTop: 10, padding: '16px 24px', background: '#a855f7', color: '#fff', 
                  border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(168, 85, 247, 0.25)', transition: 'all 0.2s'
                }}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── MAP SECTION (Placeholder) ── */}
      <section style={{ maxWidth: 1100, margin: '80px auto 0', padding: '0 24px', animation: 'fadeInUp 1.4s ease' }}>
        <div style={{ height: 400, width: '100%', background: '#0a0a0a', borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', flexDirection: 'column', gap: 16 }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Google Maps Integration Placeholder</div>
          </div>
        </div>
      </section>
    </div>
  );
};
