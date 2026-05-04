import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ParticleBackground } from '../components/ParticleBackground';

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
    >
      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" opacity="0.3" />
      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

// ─── OTP input – 6 individual boxes ──────────────────────────────────────────
function OtpInput({ value, onChange, disabled }: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  // All 6 refs declared at the top level (never inside a loop)
  const r0 = React.useRef<HTMLInputElement>(null);
  const r1 = React.useRef<HTMLInputElement>(null);
  const r2 = React.useRef<HTMLInputElement>(null);
  const r3 = React.useRef<HTMLInputElement>(null);
  const r4 = React.useRef<HTMLInputElement>(null);
  const r5 = React.useRef<HTMLInputElement>(null);
  const refs = [r0, r1, r2, r3, r4, r5];

  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        // Clear current digit
        const next = value.slice(0, i) + value.slice(i + 1);
        onChange(next);
      } else if (i > 0) {
        // Move back and clear previous
        const next = value.slice(0, i - 1) + value.slice(i);
        onChange(next);
        refs[i - 1].current?.focus();
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      refs[i - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && i < 5) {
      refs[i + 1].current?.focus();
    }
  };

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const arr = value.padEnd(6, ' ').split('').slice(0, 6);
    arr[i] = digit;
    onChange(arr.join('').trimEnd());
    if (i < 5) setTimeout(() => refs[i + 1].current?.focus(), 0);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => refs[focusIdx].current?.focus(), 0);
  };

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {digits.map((d, i) => {
        const filled = d.trim() !== '';
        return (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={filled ? d : ''}
            disabled={disabled}
            onPaste={handlePaste}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            onFocus={e => e.target.select()}
            autoFocus={i === 0}
            style={{
              width: 48, height: 56, textAlign: 'center',
              fontSize: 22, fontWeight: 700,
              fontFamily: '"DM Sans", system-ui, sans-serif',
              borderRadius: 12,
              border: filled ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
              background: disabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease',
              cursor: disabled ? 'not-allowed' : 'text',
              caretColor: '#fff',
              boxShadow: filled ? '0 0 20px rgba(255,255,255,0.2)' : 'none',
              backdropFilter: 'blur(20px)',
            }}
          />
        );
      })}
    </div>
  );
}



// ─── Main Login Page ──────────────────────────────────────────────────────────
export const Login = () => {
  const { login, verifyOtp } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState<string | number | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);   // locks the login button after OTP is sent
  const [showPass, setShowPass] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const navigate = useNavigate();

  // ── Step 1: login ──────────────────────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || otpSent) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      setUserId(res.user_id);
      setOtpSent(true);
      setStep(2);
      setSubmitting(false); // unlock OTP boxes
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  const handleOtpSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    const currentOtp = otp.trim();
    if (currentOtp.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (!userId) {
      setError('Session expired. Please start again.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await verifyOtp({ user_id: userId, otp: currentOtp });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
      setOtp('');
      setSubmitting(false);
    }
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', padding: '13px 16px', borderRadius: 12,
    border: focused ? '2px solid #fff' : '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255, 255, 255, 0.08)',
    fontSize: 15, color: '#fff',
    fontFamily: '"DM Sans", system-ui, sans-serif', outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 30px rgba(255,255,255,0.1)' : 'none',
    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
    backdropFilter: 'blur(30px)',
  });

  const btnDisabled = step === 1
    ? submitting || otpSent || !email || !password
    : submitting || otp.length < 6;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{
        display: 'flex', 
        minHeight: '100vh', 
        fontFamily: '"DM Sans", system-ui, sans-serif',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)', // More vibrant gradient
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <ParticleBackground />

        {/* Ambient Glowing Blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%', width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(60px)',
        }} />

        <div style={{
          width: '100%', 
          maxWidth: 460, 
          padding: '24px',
          position: 'relative', 
          zIndex: 10,
          animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          {/* Logo above card */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/logo.png" alt="CDTA"
              style={{ height: 90, width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </div>

          {/* Login Card with Glassmorphism */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)', 
            backdropFilter: 'blur(60px) saturate(180%)',
            borderRadius: 40, 
            padding: '60px 48px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', // White text for dark glass
          }}>

            <div style={{ display: 'flex', gap: 6, marginBottom: 40 }}>
              {[1, 2].map(s => (
                <div key={s} style={{
                  height: 4, borderRadius: 4,
                  flex: step === s ? 2 : 1,
                  background: step >= s ? '#fff' : 'rgba(255,255,255,0.1)',
                  transition: 'flex 0.4s ease, background 0.3s ease',
                }} />
              ))}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                margin: '0 0 8px', fontSize: 26, fontWeight: 700,
                color: '#fff', letterSpacing: '-0.5px',
              }}>
                {step === 1 ? 'Welcome back' : 'Check your email'}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                {step === 1
                  ? 'Enter your credentials to sign in.'
                  : `We sent a 6-digit code to ${email}`}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 12, padding: '12px 14px', marginBottom: 22,
                animation: 'fadeIn 0.25s ease',
              }}>
                <svg width="16" height="16" fill="none" stroke="#ef4444" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontSize: 13.5, color: '#dc2626', lineHeight: 1.45 }}>{error}</span>
              </div>
            )}

            {/* ── STEP 1: Email + Password ── */}
            {step === 1 && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="admin@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    disabled={submitting || otpSent}
                    required
                    style={inputStyle(emailFocused)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onFocus={() => setPassFocused(true)}
                      onBlur={() => setPassFocused(false)}
                      disabled={submitting || otpSent}
                      required
                      style={{ ...inputStyle(passFocused), paddingRight: 46 }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPass(p => !p)}
                      style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: '#94a3b8', padding: 4, display: 'flex', alignItems: 'center',
                      }}
                    >
                      {showPass ? (
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={btnDisabled}
                  style={{
                    marginTop: 12, width: '100%', padding: '16px',
                    borderRadius: 14, border: 'none',
                    background: btnDisabled ? 'rgba(255,255,255,0.1)' : '#fff',
                    color: btnDisabled ? 'rgba(255,255,255,0.3)' : '#0a0a0a', 
                    fontSize: 15, fontWeight: 700, cursor: btnDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    boxShadow: btnDisabled ? 'none' : '0 10px 20px rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={e => { if (!btnDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { if (!btnDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  {submitting ? (
                    <><Spinner /> Sending OTP…</>
                  ) : otpSent ? (
                    <><svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> OTP Sent</>
                  ) : (
                    <>Continue<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg></>
                  )}
                </button>
              </form>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Success banner */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: 12, padding: '14px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <svg width="16" height="16" fill="none" stroke="#4ade80" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span style={{ fontSize: 13.5, color: '#4ade80' }}>Code sent — check your inbox or spam folder.</span>
                </div>

                {/* OTP boxes */}
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600,
                    color: 'rgba(255,255,255,0.7)', marginBottom: 20, textAlign: 'center',
                  }}>
                    Enter the 6-digit code
                  </label>
                  <OtpInput value={otp} onChange={setOtp} disabled={submitting} />
                </div>

                <button
                  id="otp-submit-btn"
                  type="submit"
                  disabled={btnDisabled}
                  style={{
                    width: '100%', padding: '16px',
                    borderRadius: 14, border: 'none',
                    background: btnDisabled ? 'rgba(255,255,255,0.1)' : '#fff',
                    color: btnDisabled ? 'rgba(255,255,255,0.3)' : '#0a0a0a', 
                    fontSize: 15, fontWeight: 700, cursor: btnDisabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    transition: 'all 0.3s ease',
                    boxShadow: btnDisabled ? 'none' : '0 10px 20px rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={e => { if (!btnDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { if (!btnDisabled) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                >
                  {submitting ? (
                    <><Spinner /> Verifying…</>
                  ) : (
                    <>Verify &amp; Sign in<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" /></svg></>
                  )}
                </button>

                {/* Back link */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => { setStep(1); setOtp(''); setError(''); setOtpSent(false); setSubmitting(false); }}
                  style={{
                    background: 'none', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                    color: 'rgba(255,255,255,0.6)', fontSize: 13.5, fontWeight: 500, textAlign: 'center',
                    padding: 0, textDecoration: 'underline', textDecorationColor: 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textDecorationColor = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.textDecorationColor = 'transparent'; }}
                >
                  ← Use a different account
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} CDTA Portal • {' '}
            <a href="mailto:support@cdta.dz" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, opacity: 0.8 }}>
              Contact support
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

