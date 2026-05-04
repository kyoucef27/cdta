import React from 'react';
import { ContentManager } from './ContentManager';
import { PageService } from '../../services/page.service';
import type { ColumnDef, FieldDef } from './types';


const columns: ColumnDef[] = [
  {
    key: 'title',
    label: 'Title',
    render: row => (
      <div>
        <span style={{ fontWeight: 600, color: '#0f172a', display: 'block' }}>{row.title ?? '—'}</span>
        {row.slug && (
          <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: '"DM Sans", system-ui, sans-serif' }}>
            /{row.slug}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'template',
    label: 'Template',
    width: 150,
    render: row => (
      <span style={{ color: '#64748b', fontSize: 13 }}>{row.template ?? 'default'}</span>
    ),
  },
  {
    key: 'updated_at',
    label: 'Last Updated',
    width: 160,
    render: row => row.updated_at
      ? new Date(row.updated_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—',
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
  { key: 'title', label: 'Page Title', type: 'text', required: true, placeholder: 'e.g. About Us' },
  { key: 'slug', label: 'Slug', type: 'text', placeholder: 'e.g. about-us (auto-generated if blank)' },
  { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Page body content…' },
  { key: 'meta_description', label: 'Meta Description', type: 'textarea', placeholder: 'SEO description (160 chars max)' },
  {
    key: 'template', label: 'Template', type: 'select',
    options: [
      { value: 'default', label: 'Default' },
      { value: 'full-width', label: 'Full Width' },
      { value: 'landing', label: 'Landing Page' },
      { value: 'gallery', label: 'Image Gallery' },
      { value: 'fullscreen-image', label: 'Fullscreen Visual' },
      { value: 'contact', label: 'Contact' },
    ],
  },
  {
    key: 'status', label: 'Status', type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' },
    ],
  },
  { key: 'image', label: 'Featured Image', type: 'image' },
  { key: 'gallery_images', label: 'Gallery Images', type: 'images_multiple' },
];

const icon = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const PagesManager = () => (
  <ContentManager
    title="Pages"
    entityName="Page"
    accentColor="#0a0a0a"
    accentBg="rgba(99,102,241,0.12)"
    columns={columns}
    fields={fields}
    service={PageService}
    icon={icon}
    toFormValues={row => ({
      title: row.title ?? '',
      slug: row.slug ?? '',
      content: row.content ?? '',
      meta_description: row.meta_description ?? '',
      template: row.template ?? 'default',
      status: row.status ?? 'draft',
    })}
  />
);

