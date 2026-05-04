import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      padding: 24,
      fontFamily: '"DM Sans", sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '120px', 
        fontWeight: 800, 
        margin: 0, 
        lineHeight: 1,
        background: 'linear-gradient(to bottom, #6366f1, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: '"DM Serif Display", serif'
      }}>
        404
      </h1>
      <h2 style={{ fontSize: 24, fontWeight: 600, margin: '20px 0 10px' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: 400, marginBottom: 40, lineHeight: 1.6 }}>
        The horizon you are looking for does not exist. It may have been moved or deleted.
      </p>
      <Link to="/" style={{
        padding: '12px 28px',
        background: '#fff',
        color: '#0a0a0a',
        textDecoration: 'none',
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 15,
        transition: 'transform 0.2s'
      }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        Back to Home
      </Link>
    </div>
  );
};
