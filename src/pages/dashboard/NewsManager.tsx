import React from 'react';
import { ContentManager } from './ContentManager';
import { NewsService } from '../../services/news.service';
import type { ColumnDef, FieldDef } from './types';


const columns: ColumnDef[] = [
  {
    key: 'title',
    label: 'Title',
    render: row => (
      <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.title ?? '—'}</span>
    ),
  },
  {
    key: 'category',
    label: 'Category',
    width: 150,
    render: row => row.category
      ? <span style={{ color: '#64748b', fontSize: 13 }}>{row.category}</span>
      : <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>,
  },
  {
    key: 'published_at',
    label: 'Published',
    width: 150,
    render: row => row.published_at
      ? new Date(row.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : <span style={{ color: '#cbd5e1' }}>—</span>,
  },
  {
    key: 'status',
    label: 'Status',
    width: 110,
    render: row => {
      const s = row.status ?? 'draft';
      const map: Record<string, { bg: string; color: string }> = {
        published: { bg: '#dcfce7', color: '#16a34a' },
        draft: { bg: '#f1f5f9', color: '#64748b' },
        archived: { bg: '#fef9c3', color: '#ca8a04' },
      };
      const style = map[s] ?? map.draft;
      return (
        <span style={{
          padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
          background: style.bg, color: style.color,
        }}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </span>
      );
    },
  },
];

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'News headline' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Announcement' },
  { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Full news content…' },
  { key: 'published_at', label: 'Publish Date', type: 'date' },
  {
    key: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  { key: 'image', label: 'Image', type: 'image' },
];

const icon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
  </svg>
);

export const NewsManager = () => (
  <ContentManager
    title="News"
    entityName="News Article"
    accentColor="#10b981"
    accentBg="rgba(16,185,129,0.12)"
    columns={columns}
    fields={fields}
    service={NewsService}
    icon={icon}
    toFormValues={row => ({
      title: row.title ?? '',
      category: row.category ?? '',
      content: row.content ?? '',
      published_at: row.published_at ? row.published_at.slice(0, 10) : '',
      status: row.status ?? 'draft',
    })}
  />
);

