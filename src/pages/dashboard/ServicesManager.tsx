import React from 'react';
import { ContentManager } from './ContentManager';
import { ServiceService } from '../../services/service.service';
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
    width: 160,
    render: row => row.category
      ? <span style={{ color: '#64748b', fontSize: 13 }}>{row.category}</span>
      : <span style={{ color: '#cbd5e1', fontSize: 13 }}>—</span>,
  },
  {
    key: 'order',
    label: 'Order',
    width: 80,
    render: row => (
      <span style={{ color: '#64748b', fontSize: 13, textAlign: 'center', display: 'block' }}>
        {row.order ?? '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    width: 110,
    render: row => {
      const s = row.status ?? 'active';
      const map: Record<string, { bg: string; color: string }> = {
        active: { bg: '#dcfce7', color: '#16a34a' },
        inactive: { bg: '#f1f5f9', color: '#64748b' },
        draft: { bg: '#fef9c3', color: '#ca8a04' },
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
  { key: 'title', label: 'Service Title', type: 'text', required: true, placeholder: 'e.g. Digital Training' },
  { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Training, Consulting…' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief service description…' },
  { key: 'url', label: 'Link URL', type: 'url', placeholder: 'https://…' },
  { key: 'order', label: 'Display Order', type: 'text', placeholder: '1, 2, 3…' },
  {
    key: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' },
    ],
  },
  { key: 'image', label: 'Image', type: 'image' },
];

const icon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const ServicesManager = () => (
  <ContentManager
    title="Services"
    entityName="Service"
    accentColor="#ec4899"
    accentBg="rgba(236,72,153,0.12)"
    columns={columns}
    fields={fields}
    service={ServiceService}
    icon={icon}
    toFormValues={row => ({
      title: row.title ?? '',
      category: row.category ?? '',
      description: row.description ?? '',
      url: row.url ?? '',
      order: String(row.order ?? ''),
      status: row.status ?? 'active',
    })}
  />
);

