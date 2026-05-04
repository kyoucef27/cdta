import React from 'react';
import { ContentManager } from './ContentManager';
import { EventService } from '../../services/event.service';
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
    key: 'start_date',
    label: 'Timeline',
    width: 220,
    render: row => {
      const start = row.start_date ? new Date(row.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—';
      const end = row.end_date ? new Date(row.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
      return (
        <span style={{ color: '#64748b', fontSize: 13 }}>
          {start} {end ? `→ ${end}` : ''}
        </span>
      );
    },
  },
  {
    key: 'location',
    label: 'Location',
    width: 180,
    render: row => (
      <span style={{ color: '#64748b', fontSize: 13 }}>{row.location ?? '—'}</span>
    ),
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
          fontFamily: '"DM Sans", system-ui, sans-serif',
        }}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </span>
      );
    },
  },
];

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Event title' },
  { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description…' },
  { key: 'start_date', label: 'Start Date', type: 'date', required: true },
  { key: 'end_date', label: 'End Date', type: 'date', required: false },
  { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'City or venue' },
  { key: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Workshop, Seminar' },
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const EventsManager = () => (
  <ContentManager
    title="Events"
    entityName="Event"
    accentColor="#f59e0b"
    accentBg="rgba(245,158,11,0.12)"
    columns={columns}
    fields={fields}
    service={EventService}
    icon={icon}
    toFormValues={row => ({
      title: row.title ?? '',
      description: row.description ?? '',
      start_date: row.start_date ? row.start_date.slice(0, 10) : '',
      end_date: row.end_date ? row.end_date.slice(0, 10) : '',
      location: row.location ?? '',
      category: row.category ?? 'General',
      status: row.status ?? 'draft',
    })}
  />
);

