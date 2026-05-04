import React, { useState, useEffect } from 'react';
import type { FieldDef } from './types';
import { LexicalEditor } from '../../components/LexicalEditor';
import { Link } from 'react-router-dom';

// Re-export for convenience
export type { FieldDef } from './types';

interface ContentModalProps {
  title: string;
  fields: FieldDef[];
  initialValues?: Record<string, any>;
  onClose: () => void;
  onSubmit: (data: Record<string, any>, imageFile?: File | null, galleryFiles?: File[]) => Promise<void>;
  loading?: boolean;
}

// ─── Input styles ──────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: 14,
  color: '#0f172a',
  fontFamily: '"DM Sans", system-ui, sans-serif',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Field({ def, value, onChange }: { def: FieldDef; value: any; onChange: (v: any) => void }) {
  const [focused, setFocused] = useState(false);
  const focusStyle: React.CSSProperties = focused
    ? { borderColor: '#0a0a0a', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)', background: '#fff' }
    : {};

  if (def.type === 'textarea') {
    return (
      <LexicalEditor
        value={value ?? ''}
        onChange={onChange}
        placeholder={def.placeholder}
      />
    );
  }
  if (def.type === 'select') {
    return (
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        required={def.required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputBase, ...focusStyle, cursor: 'pointer' }}
      >
        <option value="">Select…</option>
        {def.options?.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }
  if (def.type === 'image' || def.type === 'images_multiple') {
    return null; // handled separately
  }
  return (
    <input
      type={def.type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={def.placeholder}
      required={def.required}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputBase, ...focusStyle }}
    />
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export const ContentModal = ({ title, fields, initialValues = {}, onClose, onSubmit, loading }: ContentModalProps) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Sync initial values if they change (edit mode)
  useEffect(() => { setValues(initialValues); }, [JSON.stringify(initialValues)]);

  const hasImageField = fields.some(f => f.type === 'image');
  const hasGalleryField = fields.some(f => f.type === 'images_multiple');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4); // Max 4 extra
    setGalleryFiles(files);
    
    // Read previews
    Promise.all(files.map(f => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target?.result as string);
      reader.readAsDataURL(f);
    }))).then(previews => setGalleryPreviews(previews));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values, hasImageField ? imageFile : undefined, hasGalleryField ? galleryFiles : undefined);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(6px)', zIndex: 200,
          animation: 'fadeIn 0.2s ease',
        }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 520,
        background: '#fff', zIndex: 201,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 28px', borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            {title}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              style={{
                padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0',
                background: previewMode ? '#0a0a0a' : '#fff', 
                color: previewMode ? '#fff' : '#64748b',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: '"DM Sans", system-ui, sans-serif'
              }}
            >
              {previewMode ? 'Edit Mode' : 'Live Preview'}
            </button>
            <button
              onClick={onClose}
              style={{
                width: 34, height: 34, borderRadius: 10, border: '1.5px solid #e2e8f0',
                background: 'transparent', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#64748b',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {!previewMode ? (
            fields.filter(f => f.type !== 'image' && f.type !== 'images_multiple').map(def => (
              <div key={def.key}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 600, color: '#374151',
                  marginBottom: 6, fontFamily: '"DM Sans", system-ui, sans-serif',
                }}>
                  {def.label}
                  {def.required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
                </label>
                <Field
                  def={def}
                  value={values[def.key]}
                  onChange={v => setValues(prev => ({ ...prev, [def.key]: v }))}
                />
              </div>
            ))
          ) : (
            <div style={{ 
              background: '#050505', padding: '40px', borderRadius: 16, 
              color: '#fff', minHeight: '100%' 
            }}>
              <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 32, marginBottom: 24 }}>{values.title}</h1>
              <div 
                className="dynamic-content"
                style={{ 
                  fontFamily: '"Spectral", serif', fontSize: 18, lineHeight: 1.8, color: '#fff' 
                }}
                dangerouslySetInnerHTML={{ __html: values.content }} 
              />
              <style>{`
                .dynamic-content p { margin-bottom: 1.5em; }
                .dynamic-content ul, .dynamic-content ol { padding-left: 20px; margin-bottom: 1.5em; }
                .dynamic-content blockquote { border-left: 2px solid #fff; padding-left: 20px; font-style: italic; opacity: 0.8; }
              `}</style>
            </div>
          )}

          {/* Image uploads (only in edit mode) */}
          {!previewMode && (
            <>
              {hasImageField && (
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151',
                    marginBottom: 6, fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}>
                    Featured Image
                  </label>
                  <label
                    htmlFor="modal-image-input"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      border: '2px dashed #cbd5e1', borderRadius: 12, padding: '24px 16px',
                      cursor: 'pointer', background: '#f8fafc', transition: 'border-color 0.2s',
                      minHeight: 120, textAlign: 'center',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <>
                        <svg width="28" height="28" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={{ fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                          Click to upload an image
                        </span>
                      </>
                    )}
                  </label>
                  <input id="modal-image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
              )}

              {hasGalleryField && (
                <div>
                  <label style={{
                    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151',
                    marginBottom: 6, fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}>
                    Gallery Images (Up to 4)
                  </label>
                  <label
                    htmlFor="modal-gallery-input"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      border: '2px dashed #cbd5e1', borderRadius: 12, padding: '24px 16px',
                      cursor: 'pointer', background: '#f8fafc', transition: 'border-color 0.2s',
                      minHeight: 120, textAlign: 'center',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#0a0a0a')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#cbd5e1')}
                  >
                    {galleryPreviews.length > 0 ? (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {galleryPreviews.map((p, i) => (
                          <img key={i} src={p} alt={`preview ${i}`} style={{ height: 80, width: 80, borderRadius: 8, objectFit: 'cover' }} />
                        ))}
                      </div>
                    ) : (
                      <>
                        <svg width="28" height="28" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ marginBottom: 8 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span style={{ fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                          Click to upload up to 4 images
                        </span>
                      </>
                    )}
                  </label>
                  <input id="modal-gallery-input" type="file" multiple accept="image/*" onChange={handleGalleryChange} style={{ display: 'none' }} />
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8, borderTop: '1px solid #f1f5f9', marginTop: 'auto' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10, border: '1.5px solid #e2e8f0',
                background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || loading}
              style={{
                flex: 2, padding: '11px 0', borderRadius: 10, border: 'none',
                background: submitting || loading ? '#a5b4fc' : '#0a0a0a',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: submitting || loading ? 'not-allowed' : 'pointer',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
              onMouseLeave={e => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = '#0a0a0a'; }}
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
      `}</style>
    </>
  );
};

