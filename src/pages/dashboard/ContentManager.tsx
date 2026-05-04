import React, { useState, useEffect, useCallback } from 'react';
import { ContentModal } from './ContentModal';
import type { FieldDef, ColumnDef } from './types';
import { useDashboard } from '../../contexts/DashboardContext';

// Re-export for convenience
export type { ColumnDef } from './types';

export interface ContentManagerProps {
  title: string;
  entityName: string;       // singular, e.g. "Event"
  accentColor: string;
  accentBg: string;
  columns: ColumnDef[];
  fields: FieldDef[];
  service: {
    getAll: () => Promise<any>;
    create: (data: any, image?: File | null, gallery?: File[]) => Promise<any>;
    update: (id: any, data: any, image?: File | null, gallery?: File[]) => Promise<any>;
    delete: (id: any) => Promise<any>;
    updateImage?: (id: any, fd: FormData) => Promise<any>;
  };
  extractRows?: (response: any) => any[];
  toFormValues?: (row: any) => Record<string, any>;
  icon: React.ReactNode;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const defaultExtract = (res: any): any[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const PAGE_SIZE = 8;

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div onClick={onCancel} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(4px)', zIndex: 300,
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        background: '#fff', borderRadius: 20, padding: '32px 36px',
        zIndex: 301, width: 360, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
        animation: 'popIn 0.25s cubic-bezier(0.22,1,0.36,1)',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', background: '#fef2f2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
        }}>
          <svg width="22" height="22" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: '#0f172a', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
          Delete "{name}"?
        </h3>
        <p style={{ margin: '0 0 24px', fontSize: 13.5, color: '#64748b', fontFamily: '"DM Sans", system-ui, sans-serif', lineHeight: 1.5 }}>
          This action cannot be undone. The item will be permanently removed.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e2e8f0',
            background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: '#ef4444', color: '#fff', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>
            Delete
          </button>
        </div>
      </div>
      <style>{`@keyframes popIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.92) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }`}</style>
    </>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 400,
      background: type === 'success' ? '#10b981' : '#ef4444',
      color: '#fff', padding: '12px 20px', borderRadius: 12,
      fontSize: 13.5, fontWeight: 600, fontFamily: '"DM Sans", system-ui, sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'toastIn 0.3s cubic-bezier(0.22,1,0.36,1)',
    }}>
      {type === 'success'
        ? <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
        : <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
      }
      {message}
      <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const ContentManager = ({
  title, entityName, accentColor, accentBg,
  columns, fields, service, extractRows, toFormValues, icon,
}: ContentManagerProps) => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<any | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { cache, setCache, invalidateCache } = useDashboard();
  
  // Use cache as initial state for rows
  useEffect(() => {
    if (cache[title]) {
      setRows(cache[title]);
      setLoading(false);
    }
  }, [title]); // Only on mount/switch


  const extract = extractRows ?? defaultExtract;
  const nameKey = columns[0]?.key ?? 'title'; // first column used as display name

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchRows = useCallback(async () => {
    // Only show full loading if we have no cache
    if (!cache[title]) setLoading(true);
    
    try {
      const res = await service.getAll();
      const data = extract(res);
      setRows(data);
      setCache(title, data); // Update cache
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [title, setCache]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = () => { setEditRow(null); setModalOpen(true); };
  const handleEdit = (row: any) => { setEditRow(row); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditRow(null); };

  const handleSubmit = async (data: Record<string, any>, imageFile?: File | null, galleryFiles?: File[]) => {
    try {
      let saved: any;
      if (editRow) {
        saved = await service.update(editRow.id, data, imageFile, galleryFiles);
      } else {
        saved = await service.create(data, imageFile, galleryFiles);
      }
      // Upload image if provided
      if (imageFile && service.updateImage) {
        const fd = new FormData();
        fd.append('image', imageFile);
        await service.updateImage(saved?.data?.id ?? saved?.id ?? editRow?.id, fd);
      }
      showToast(`${entityName} ${editRow ? 'updated' : 'created'} successfully`, 'success');
      invalidateCache(title); // Force fresh data
      handleCloseModal();
      fetchRows();
    } catch (err: any) {
      showToast(err.message ?? 'Something went wrong', 'error');
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await service.delete(deleteTarget.id);
      showToast(`${entityName} deleted`, 'success');
      invalidateCache(title);
      setDeleteTarget(null);
      fetchRows();
    } catch (err: any) {
      showToast(err.message ?? 'Delete failed', 'error');
      setDeleteTarget(null);
    }
  };

  // ── Filtering & pagination ─────────────────────────────────────────────────
  const filtered = rows.filter(r =>
    columns.some(c => String(r[c.key] ?? '').toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 on search change
  useEffect(() => { setPage(1); }, [search]);

  return (
    <div style={{ padding: '32px 36px', minHeight: '100%' }}>

      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: accentBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, flexShrink: 0,
          }}>
            {icon}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#0f172a', fontFamily: '"DM Sans", system-ui, sans-serif', letterSpacing: '-0.3px' }}>
              {title}
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? entityName.toLowerCase() : entityName.toLowerCase() + 's'}`}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg width="15" height="15" fill="none" stroke="#94a3b8" viewBox="0 0 24 24"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9,
                borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#f8fafc',
                fontSize: 13.5, color: '#0f172a', fontFamily: '"DM Sans", system-ui, sans-serif',
                outline: 'none', width: 200,
              }}
            />
          </div>

          {/* Create button */}
          <button
            id={`create-${entityName.toLowerCase()}-btn`}
            onClick={handleCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: accentColor, color: '#fff',
              fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              boxShadow: `0 4px 12px ${accentColor}40`,
              transition: 'opacity 0.2s, transform 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New {entityName}
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden',
      }}>
        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {columns.map(col => (
                  <th key={col.key} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 11.5, fontWeight: 700, color: '#94a3b8',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    width: col.width,
                  }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ padding: '12px 16px', width: 100, textAlign: 'right',
                  fontSize: 11.5, fontWeight: 700, color: '#94a3b8',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '14px 16px' }}>
                        <div style={{
                          height: 16, borderRadius: 8, background: '#f1f5f9',
                          width: `${40 + Math.random() * 50}%`,
                          animation: 'shimmer 1.8s infinite ease-in-out',
                        }} />
                      </td>
                    ))}
                    <td style={{ padding: '14px 16px' }} />
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ color: '#94a3b8', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
                      <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 12px', opacity: 0.4 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {search ? `No results for "${search}"` : `No ${entityName.toLowerCase()}s yet`}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fafafa'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}
                  >
                    {columns.map(col => (
                      <td key={col.key} style={{
                        padding: '14px 16px', fontSize: 13.5, color: '#1e293b',
                        fontFamily: '"DM Sans", system-ui, sans-serif', verticalAlign: 'middle',
                      }}>
                        {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                      </td>
                    ))}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEdit(row)}
                          title="Edit"
                          style={{
                            width: 32, height: 32, borderRadius: 8, border: '1.5px solid #e2e8f0',
                            background: '#fff', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#0a0a0a',
                            transition: 'background 0.15s, border-color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#eef2ff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#a5b4fc'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(row)}
                          title="Delete"
                          style={{
                            width: 32, height: 32, borderRadius: 8, border: '1.5px solid #e2e8f0',
                            background: '#fff', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                            transition: 'background 0.15s, border-color 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#fca5a5'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; }}
                        >
                          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > PAGE_SIZE && (
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fafafa',
          }}>
            <span style={{ fontSize: 13, color: '#64748b', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              Page {page} of {totalPages}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: page === i + 1 ? 'none' : '1.5px solid #e2e8f0',
                    background: page === i + 1 ? accentColor : '#fff',
                    color: page === i + 1 ? '#fff' : '#374151',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <ContentModal
          title={editRow ? `Edit ${entityName}` : `New ${entityName}`}
          fields={fields}
          initialValues={editRow && toFormValues ? toFormValues(editRow) : (editRow ?? {})}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteDialog
          name={String(deleteTarget[nameKey] ?? deleteTarget.id)}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <style>{`
        @keyframes shimmer {
          0% { opacity: 1 }
          50% { opacity: 0.5 }
          100% { opacity: 1 }
        }
      `}</style>
    </div>
  );
};

